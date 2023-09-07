import { createSignal } from "solid-js";
import { backgroundScriptActions } from "../background/actions";
import { PopupMessage, PopupPageEvent } from "./types";
import { ClientType } from "../background/types";
import { getData } from "../storage";

const [tabId, setTabId] = createSignal<number>(null);
const [joinCode, setJoinCode] = createSignal<string>(null);
const [clientType, setClientType] = createSignal<ClientType>("receiver");
const [isLocked, setIsLocked] = createSignal(false);

const reset = () => {
	setTabId(null);
	setJoinCode(null);
	setIsLocked(false);
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
	const data = await getData();
	if (data.clientType) {
		setIsLocked(true);
		setClientType(data.clientType);
	}
	setTabId(data.tabId);
	setJoinCode(data.joinCode);
};

init();

const startReceiving = (joinCode: string) => {
	setIsLocked(true);
	backgroundScriptActions.startReceiving(joinCode);
};

const startStreaming = (tabId: number) => {
	setIsLocked(true);
	setTabId(tabId);
	backgroundScriptActions.startSharing(tabId);
};

const stopStreaming = () => {
	reset();
	backgroundScriptActions.stop();
};

export {
	tabId,
	joinCode,
	clientType,
	setClientType,
	startReceiving,
	startStreaming,
	stopStreaming,
	isLocked,
};
