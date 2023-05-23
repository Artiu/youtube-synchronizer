import { createSignal } from "solid-js";
import { backgroundScriptActions } from "../background/actions";
import { PopupMessage, PopupPageEvent } from "./types";

const [tabId, setTabId] = createSignal<number | null>(null);
const [joinCode, setJoinCode] = createSignal<string | null>(null);
const [clientType, setClientType] = createSignal<"receiver" | "sender" | null>(null);

const reset = () => {
    setTabId(null);
    setJoinCode(null);
    setClientType(null);
};

const updateTabId = (newTabId: number) => {
    setTabId(newTabId);
    backgroundScriptActions.changeTab(newTabId);
};

chrome.runtime.onMessage.addListener((msg: PopupMessage) => {
    if (msg.type === PopupPageEvent.Code) {
        setJoinCode(msg.code);
        return;
    }
    if (msg.type === PopupPageEvent.WsClosed || msg.type === PopupPageEvent.SseError) {
        reset();
    }
});

const init = async () => {
    const data = await backgroundScriptActions.getInitialPopupData();
    setTabId(data.tabId);
    setJoinCode(data.joinCode);
    setClientType(data.clientType);
};
init();

const startReceiving = (joinCode: string) => {
    setClientType("receiver");
    backgroundScriptActions.startReceiving(joinCode);
};

const startStreaming = (tabId: number) => {
    setClientType("sender");
    setTabId(tabId);
    backgroundScriptActions.startSharing(tabId);
};

const stopStreaming = () => {
    reset();
    backgroundScriptActions.stop();
};

export { tabId, updateTabId, joinCode, clientType, startReceiving, startStreaming, stopStreaming };
