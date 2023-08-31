import { ContentScriptEvent } from "./types";

const startSharing = (tabId: number) => {
	chrome.tabs.sendMessage(tabId, ContentScriptEvent.StartSharing);
};

const startReceiving = (tabId: number) => {
	chrome.tabs.sendMessage(tabId, ContentScriptEvent.StartReceiving);
};

const stopSharing = (tabId: number) => {
	chrome.tabs.sendMessage(tabId, ContentScriptEvent.StopSharing);
};

const stopReceiving = (tabId: number) => {
	chrome.tabs.sendMessage(tabId, ContentScriptEvent.StopReceiving);
};

export const contentScriptActions = { startSharing, startReceiving, stopSharing, stopReceiving };
