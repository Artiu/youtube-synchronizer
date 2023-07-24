import { BACKEND_URL, WEBSOCKET_URL } from "@src/config";
import {
	BackgroundScriptEvent,
	BackgroundScriptMessage,
	ClientType,
	PathChangeMessage,
} from "./types";
import { popupPageActions } from "../popup/actions";
import { contentScriptActions } from "../content/actions";
import { sendServerMessage } from "../serverMessage";

let tabId: number;
let clientType: ClientType;
let joinCode: string;
let connection: chrome.runtime.Port;
let ws: WebSocket;
let sse: EventSource;
let reconnectKey: string;

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
reset();

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
			ws = new WebSocket(
				WEBSOCKET_URL + `/ws${reconnectKey ? `?reconnectKey=${reconnectKey}` : ""}`
			);
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
				const message = JSON.parse(msg.data);
				if (message.type === "reconnectKey") {
					reconnectKey = message.key;
				}
				if (message.type === "code") {
					joinCode = message.code;
					popupPageActions.sendCode(joinCode);
				}
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
			const setupSSE = () => {
				sse = new EventSource(BACKEND_URL + "/room/" + message.joinCode);
				sse.addEventListener("open", async () => {
					const tab = await chrome.tabs.create({
						url: "https://www.youtube.com",
					});
					joinCode = message.joinCode;
					tabId = tab.id;
					clientType = "receiver";
				});
				sse.addEventListener("message", (ev) => {
					sendServerMessage(connection, JSON.parse(ev.data));
				});
				sse.addEventListener("error", (e) => {
					popupPageActions.sendSseError("Incorrect code!");
					reset();
				});
			};
			setupSSE();
			break;
		case BackgroundScriptEvent.TabReady:
			if (sender.tab?.id !== tabId) break;
			connection = chrome.tabs.connect(tabId);
			connection.onMessage.addListener((message: PathChangeMessage) => {
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
			});
			connection.onDisconnect.addListener(() => {
				connection = null;
			});
			contentScriptActions.startSharing(connection);
			break;
		case BackgroundScriptEvent.Stop:
			reconnectKey = null;
			reset();
			break;
	}
});
