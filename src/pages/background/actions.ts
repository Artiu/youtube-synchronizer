import { BackgroundScriptEvent, BackgroundScriptMessage, InitialPopupData } from "./types";

const sendMessageToBackgroundScript = (message: BackgroundScriptMessage) => {
    return chrome.runtime.sendMessage(message);
};

const getInitialPopupData = async () => {
    const data: InitialPopupData = await sendMessageToBackgroundScript({
        type: BackgroundScriptEvent.InitialPopupData,
    });
    return data;
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
    sendMessageToBackgroundScript({ type: BackgroundScriptEvent.ChangeTab, tabId: newTabId });
};

const tabReady = () => {
    sendMessageToBackgroundScript({ type: BackgroundScriptEvent.TabReady });
};

export const backgroundScriptActions = {
    getInitialPopupData,
    startReceiving,
    startSharing,
    stop,
    changeTab,
    tabReady,
};
