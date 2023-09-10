import { ContentScriptEvent } from "./types";

const startSharing = (tabId: number) => {
	chrome.tabs.sendMessage(tabId, ContentScriptEvent.StartSharing);
};

const startReceiving = (tabId: number) => {
	chrome.tabs.sendMessage(tabId, ContentScriptEvent.StartReceiving);
};

const changeTab = (tabId: number) => {
	chrome.tabs.sendMessage(tabId, ContentScriptEvent.ChangeTab);
};

const stopSharing = (tabId: number) => {
	chrome.tabs.sendMessage(tabId, ContentScriptEvent.StopSharing);
};

const stopReceiving = (tabId: number) => {
	chrome.tabs.sendMessage(tabId, ContentScriptEvent.StopReceiving);
};

const reconnect = (tabId: number) => {
	chrome.tabs.sendMessage(tabId, ContentScriptEvent.Reconnect);
};

export const contentScriptActions = {
	startSharing,
	startReceiving,
	changeTab,
	stopSharing,
	stopReceiving,
	reconnect,
};
