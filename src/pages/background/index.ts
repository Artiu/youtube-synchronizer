import { BACKEND_URL } from "@src/config";

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
    connection.disconnect();
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

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    switch (message.type) {
        case "initialPopupData":
            sendResponse({ tabId, clientType, joinCode });
            break;
        case "startSharing":
            ws = new WebSocket(BACKEND_URL);
            ws.addEventListener("message", (msg) => {
                chrome.runtime.sendMessage(msg);
            });
            tabId = message.tabId;
            clientType = "sender";
            connection = chrome.tabs.connect(tabId);
            connection.onMessage.addListener((message) => {
                ws.send(JSON.stringify(message));
            });
            connection.postMessage("startSharing");
            break;
        case "startReceiving":
            sse = new EventSource(BACKEND_URL);
            tabId = message.tabId;
            clientType = "receiver";
            connection = chrome.tabs.connect(tabId);
            connection.postMessage("startReceiving");
            sse.addEventListener("message", (ev) => {
                connection.postMessage(JSON.parse(ev.data));
            });
            break;
        case "stopSharing":
        case "stopReceiving":
            reset();
            break;
    }
});
