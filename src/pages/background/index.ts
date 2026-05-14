import { BACKEND_URL } from "@src/config";
import { BackgroundScriptEvent, BackgroundScriptMessage } from "./types";
import { popupPageActions } from "../popup/actions";
import { contentScriptActions } from "../content/actions";
import { clearData, clearReconnectKey, getData, setData } from "../storage";
// @ts-ignore
import contentScriptPath from "../content/index.ts?script";

chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" });

chrome.runtime.onInstalled.addListener(async () => {
	const tabs = await chrome.tabs.query({ url: "https://*.youtube.com/*" });
	for (const tab of tabs) {
		if (tab.id) {
			try {
				await chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: [contentScriptPath],
				});
			} catch (e) {
				console.log("Could not inject content script into tab", tab.id, e);
			}
		}
	}
});

chrome.tabs.onRemoved.addListener(async (closedTabId) => {
	const data = await getData();
	if (closedTabId !== data.tabId) return;
	clearData();
});

let abortController: AbortController | null = null;

chrome.runtime.onMessage.addListener(async (message: BackgroundScriptMessage, sender) => {
	const data = await getData();
	switch (message.type) {
		case BackgroundScriptEvent.StartSharing:
			await setData({ clientType: "sender", tabId: message.tabId });
			if (data.tabId) {
				contentScriptActions.changeTab(data.tabId);
			}
			contentScriptActions.startSharing(message.tabId);
			break;
		case BackgroundScriptEvent.StartReceiving:
			const setupReceiving = async () => {
				if (abortController) {
					abortController.abort();
				}
				abortController = new AbortController();
				let res: Response;
				try {
					res = await fetch(`${BACKEND_URL}/room/${message.joinCode}/path`, {
						signal: abortController.signal,
					});
				} catch {
					if (abortController.signal.aborted) {
						popupPageActions.sendSseError("");
						return;
					}
					popupPageActions.sendSseError("Cannot connect to server!");
					return;
				}
				if (res.status === 404) {
					popupPageActions.sendSseError("Incorrect code!");
					clearData();
					return;
				}
				if (res.status === 500) {
					popupPageActions.sendSseError("Something went wrong!");
					clearData();
					return;
				}
				const path = await res.text();
				const tab = await chrome.tabs.create({
					url: "https://www.youtube.com" + path,
				});
				await setData({
					joinCode: message.joinCode,
					tabId: tab.id,
					clientType: "receiver",
				});
				abortController = null;
			};
			setupReceiving();
			break;
		case BackgroundScriptEvent.TabReady:
			if (!sender.tab?.id || sender.tab.id !== data.tabId) break;
			if (data.clientType === "sender") {
				contentScriptActions.startSharing(data.tabId);
			}
			if (data.clientType === "receiver") {
				contentScriptActions.startReceiving(data.tabId);
			}
			break;
		case BackgroundScriptEvent.PathChange:
			if (!sender.tab?.id) break;
			chrome.scripting.executeScript({
				world: "MAIN",
				target: { tabId: sender.tab.id },
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
			break;
		case BackgroundScriptEvent.Stop:
			if (abortController) {
				abortController.abort();
			}
			clearReconnectKey();
			clearData();
			if (data.clientType === "receiver" && data.tabId !== undefined) {
				contentScriptActions.stopReceiving(data.tabId);
			}
			if (data.clientType === "sender" && data.tabId !== undefined) {
				contentScriptActions.stopSharing(data.tabId);
			}
			break;
	}
});
