import { ConnectionState } from "../connectionState";
import { PopupMessage, PopupPageEvent } from "./types";

const sendMessageToPopupPage = (message: PopupMessage) => {
	return chrome.runtime.sendMessage(message);
};

const sendUpdateConnectionState = (connectionState: ConnectionState) => {
	sendMessageToPopupPage({ type: PopupPageEvent.UpdateConnectionState, connectionState });
};

const sendSseError = (message: string) => {
	sendMessageToPopupPage({ type: PopupPageEvent.SseError, message });
};

const sendCode = (code: string) => {
	sendMessageToPopupPage({ type: PopupPageEvent.Code, code });
};

export const popupPageActions = {
	sendSseError,
	sendCode,
	sendUpdateConnectionState,
};
