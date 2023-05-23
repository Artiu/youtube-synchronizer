import { PopupMessage, PopupPageEvent } from "./types";

const sendMessageToPopupPage = (message: PopupMessage) => {
    return chrome.runtime.sendMessage(message);
};

const sendSseError = (message: string) => {
    sendMessageToPopupPage({ type: PopupPageEvent.SseError, message });
};

const sendCode = (code: string) => {
    sendMessageToPopupPage({ type: PopupPageEvent.Code, code });
};

const sendWsOpen = () => {
    sendMessageToPopupPage({ type: PopupPageEvent.WsOpen });
};

const sendWsClosed = () => {
    sendMessageToPopupPage({ type: PopupPageEvent.WsClosed });
};

export const popupPageActions = {
    sendSseError,
    sendCode,
    sendWsOpen,
    sendWsClosed,
};
