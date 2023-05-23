import { ContentScriptEvent, ContentScriptMessage } from "./types";

const sendMessage = (port: chrome.runtime.Port, message: ContentScriptMessage) => {
    port?.postMessage(message);
};
const startSharing = (port: chrome.runtime.Port) => {
    sendMessage(port, { type: ContentScriptEvent.StartSharing });
};

export const contentScriptActions = { startSharing };
