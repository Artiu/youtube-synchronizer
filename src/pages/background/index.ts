import { BACKEND_URL, WEBSOCKET_URL } from "@src/config";

let tabId: number;
let clientType: "receiver" | "sender";
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "initialPopupData":
            sendResponse({ tabId, clientType, joinCode });
            break;
        case "startSharing":
            ws = new WebSocket(WEBSOCKET_URL + "/ws");
            ws.addEventListener("open", () => {
                chrome.runtime.sendMessage({ type: "ws-opened" });
                tabId = message.tabId;
                clientType = "sender";
                connection = chrome.tabs.connect(tabId);
                connection.onMessage.addListener((message) => {
                    ws.send(JSON.stringify(message));
                });
                connection.postMessage("startSharing");
            });
            ws.addEventListener("message", (msg) => {
                const { code } = JSON.parse(msg.data);
                joinCode = code;
                chrome.runtime.sendMessage({ type: "code", code });
            });
            ws.addEventListener("close", () => {
                chrome.runtime.sendMessage({ type: "ws-closed" });
                reset();
            });
            break;
        case "changeTab":
            connection.disconnect();
            tabId = message.tabId;
            connection = chrome.tabs.connect(tabId);
            connection.onMessage.addListener((message) => {
                ws.send(JSON.stringify(message));
            });
            connection.postMessage("startSharing");
            break;
        case "startReceiving":
            sse = new EventSource(BACKEND_URL + "/room/" + message.joinCode);
            sse.addEventListener("open", async () => {
                const tab = await chrome.tabs.create({ url: "https://www.youtube.com" });
                joinCode = message.joinCode;
                tabId = tab.id;
                clientType = "receiver";
            });
            sse.addEventListener("message", (ev) => {
                connection?.postMessage(JSON.parse(ev.data));
            });
            sse.addEventListener("error", () => {
                chrome.runtime.sendMessage({ type: "sse-error", message: "Incorrect code!" });
            });
            break;
        case "tabReady":
            if (sender.tab?.id !== tabId) break;
            connection = chrome.tabs.connect(tabId);
            connection.onDisconnect.addListener(() => {
                connection = null;
            });
            connection.postMessage("startReceiving");
            break;
        case "stop":
            reset();
            break;
    }
});
