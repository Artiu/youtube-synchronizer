import { createSignal } from "solid-js";

const [tabId, setTabId] = createSignal<number | null>(null);
const [joinCode, setJoinCode] = createSignal<string | null>(null);
const [clientType, setClientType] = createSignal<"receiver" | "sender" | null>(null);

const updateTabId = (newTabId: number) => {
    chrome.runtime.sendMessage({ type: "startReceiving", tabId: newTabId });
};

chrome.runtime.onMessage.addListener((msg: any) => {
    if (!msg.code) return;
    console.log(msg);
    setJoinCode(msg.code);
});

const init = async () => {
    const data = await chrome.runtime.sendMessage({ type: "initialPopupData" });
    setTabId(data.tabId);
    setJoinCode(data.joinCode);
    setClientType(data.clientType);
};
init();

const stop = () => {
    setTabId(null);
    setJoinCode(null);
    setClientType(null);
    chrome.runtime.sendMessage({ type: "stop" });
};

export { tabId, updateTabId, joinCode, clientType, stop };
