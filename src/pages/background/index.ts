import { BACKEND_URL, WEBSOCKET_URL } from "@src/config";
import { BackgroundScriptEvent, BackgroundScriptMessage, ClientType } from "./types";
import { popupPageActions } from "../popup/actions";
import { contentScriptActions } from "../content/actions";
import { sendServerMessage } from "../serverMessage";

let tabId: number;
let clientType: ClientType;
let joinCode: string;
let connection: chrome.runtime.Port;
let ws: WebSocket;
let sse: EventSource;

const reset = () => {
    tabId = null;
    clientType = null;
    joinCode = null;
    connection?.disconnect();
    connection = null;
    ws?.close();
    ws = null;
    sse?.close();
    sse = null;
};

chrome.tabs.onRemoved.addListener((closedTabId) => {
    if (closedTabId !== tabId) return;
    reset();
});

chrome.runtime.onMessage.addListener((message: BackgroundScriptMessage, sender, sendResponse) => {
    switch (message.type) {
        case BackgroundScriptEvent.InitialPopupData:
            sendResponse({ tabId, clientType, joinCode });
            break;
        case BackgroundScriptEvent.StartSharing:
            ws = new WebSocket(WEBSOCKET_URL + "/ws");
            ws.addEventListener("open", () => {
                popupPageActions.sendWsOpen();
                tabId = message.tabId;
                clientType = "sender";
                connection = chrome.tabs.connect(tabId);
                connection.onMessage.addListener((message) => {
                    ws.send(JSON.stringify(message));
                });
                contentScriptActions.startSharing(connection);
            });
            ws.addEventListener("message", (msg) => {
                const { code } = JSON.parse(msg.data);
                joinCode = code;
                popupPageActions.sendCode(code);
            });
            ws.addEventListener("close", () => {
                popupPageActions.sendWsClosed();
                reset();
            });
            break;
        case BackgroundScriptEvent.ChangeTab:
            connection.disconnect();
            tabId = message.tabId;
            connection = chrome.tabs.connect(tabId);
            connection.onMessage.addListener((message) => {
                ws.send(JSON.stringify(message));
            });
            contentScriptActions.startSharing(connection);
            break;
        case BackgroundScriptEvent.StartReceiving:
            sse = new EventSource(BACKEND_URL + "/room/" + message.joinCode);
            sse.addEventListener("open", async () => {
                const tab = await chrome.tabs.create({ url: "https://www.youtube.com" });
                joinCode = message.joinCode;
                tabId = tab.id;
                clientType = "receiver";
            });
            sse.addEventListener("message", (ev) => {
                sendServerMessage(connection, JSON.parse(ev.data));
            });
            sse.addEventListener("error", () => {
                popupPageActions.sendSseError("Incorrect code!");
                reset();
            });
            break;
        case BackgroundScriptEvent.TabReady:
            if (sender.tab?.id !== tabId) break;
            connection = chrome.tabs.connect(tabId);
            connection.onMessage.addListener((message) => {
                if (message.type === "changePath") {
                    chrome.scripting.executeScript({
                        world: "MAIN",
                        target: { tabId },
                        func: (newPath: string) => {
                            const logo: any = document.querySelector("#logo a");
                            const data = logo.data;
                            logo.data = {
                                commandMetadata: {
                                    webCommandMetadata: {
                                        url: newPath,
                                    },
                                },
                            };
                            logo.click();
                            logo.data = data;
                        },
                        args: [message.path],
                    });
                }
            });
            connection.onDisconnect.addListener(() => {
                connection = null;
            });
            contentScriptActions.startSharing(connection);
            break;
        case BackgroundScriptEvent.Stop:
            reset();
            break;
    }
});
