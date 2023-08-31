import { BackgroundScriptEvent, BackgroundScriptMessage, InitialPopupData } from "./types";

const sendMessageToBackgroundScript = (message: BackgroundScriptMessage) => {
	return chrome.runtime.sendMessage(message);
};

const startSharing = (tabId: number) => {
	sendMessageToBackgroundScript({ type: BackgroundScriptEvent.StartSharing, tabId });
};

const startReceiving = (joinCode: string) => {
	sendMessageToBackgroundScript({ type: BackgroundScriptEvent.StartReceiving, joinCode });
};

const stop = () => {
	sendMessageToBackgroundScript({ type: BackgroundScriptEvent.Stop });
};

const changeTab = (newTabId: number) => {
	stop();
	startSharing(newTabId);
};

const tabReady = () => {
	sendMessageToBackgroundScript({ type: BackgroundScriptEvent.TabReady });
};

const changePath = (path: string) => {
	sendMessageToBackgroundScript({ type: BackgroundScriptEvent.PathChange, path });
};

export const backgroundScriptActions = {
	startReceiving,
	startSharing,
	stop,
	changeTab,
	tabReady,
	changePath,
};
