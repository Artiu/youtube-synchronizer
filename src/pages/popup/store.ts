import { createSignal } from "solid-js";

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
    chrome.runtime.sendMessage({ type: "changeTab", tabId: newTabId });
};

chrome.runtime.onMessage.addListener((msg: any) => {
    if (msg.type === "code") {
        setJoinCode(msg.code);
        return;
    }
    if (msg.type === "ws-closed" || msg.type === "sse-error") {
        reset();
    }
});

const init = async () => {
    const data = await chrome.runtime.sendMessage({ type: "initialPopupData" });
    setTabId(data.tabId);
    setJoinCode(data.joinCode);
    setClientType(data.clientType);
};
init();

const startReceiving = (joinCode: string) => {
    setClientType("receiver");
    chrome.runtime.sendMessage({ type: "startReceiving", joinCode });
};

const startStreaming = (tabId: number) => {
    setClientType("sender");
    setTabId(tabId);
    chrome.runtime.sendMessage({ type: "startSharing", tabId });
};

const stopStreaming = () => {
    reset();
    chrome.runtime.sendMessage({ type: "stop" });
};

export { tabId, updateTabId, joinCode, clientType, startReceiving, startStreaming, stopStreaming };
