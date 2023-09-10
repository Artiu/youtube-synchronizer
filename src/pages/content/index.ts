import { BACKEND_URL, WEBSOCKET_URL } from "@src/config";
import { backgroundScriptActions } from "../background/actions";
import { ServerMessage, ServerMessageEvent } from "../serverMessage";
import { updateCurrentTimeInVideo, setExactTimeInVideo, isPathSame } from "./receiver";
import { playVideo, pauseVideo, changePlaybackRate } from "./receiver";
import { stripIndex } from "./utils";
import { popupPageActions } from "../popup/actions";
import { clearData, getData, setData } from "../storage";
import { startSharing, stopSharing } from "./share";
import { ContentScriptEvent } from "./types";
import { ConnectionStateElement } from "./connectionStateElement";
import { ConnectionStateManager } from "./connectionStateManager";

let sse: EventSource = null;
let ws: WebSocket = null;
const connectionStateElement = new ConnectionStateElement();
const connectionStateManager = new ConnectionStateManager(connectionStateElement);
let isReconnecting = false;
let reconnectTry = 0;
const maxReconnectTries = 5;
let reconnectTimeout: NodeJS.Timeout = null;

const startSse = async () => {
	const data = await getData();
	if (!isReconnecting) {
		connectionStateManager.setConnectionState("connecting");
	}
	connectionStateElement.mount();
	sse = new EventSource(BACKEND_URL + "/room/" + data.joinCode);
	sse.addEventListener("open", () => {
		connectionStateManager.setConnectionState("connected");
		isReconnecting = false;
		reconnectTry = 0;
	});
	sse.addEventListener("message", (e) => {
		let msg: ServerMessage;
		try {
			msg = JSON.parse(e.data);
		} catch (err) {
			console.error(err);
			return;
		}
		if (msg.type === ServerMessageEvent.Sync) {
			const path = stripIndex(msg.path);
			if (!isPathSame(path)) {
				backgroundScriptActions.changePath(path);
			}
			if (msg.isPaused) {
				pauseVideo();
			} else {
				playVideo();
			}
			updateCurrentTimeInVideo(msg.time);
			changePlaybackRate(msg.rate);
			return;
		}

		if (msg.type === ServerMessageEvent.StartPlaying) {
			playVideo();
			setExactTimeInVideo(msg.time);
			return;
		}
		if (msg.type === ServerMessageEvent.Pause) {
			pauseVideo();
			setExactTimeInVideo(msg.time);
			return;
		}
		if (msg.type === ServerMessageEvent.PathChange) {
			backgroundScriptActions.changePath(msg.path);
			return;
		}
		if (msg.type === ServerMessageEvent.RateChange) {
			changePlaybackRate(msg.rate);
			return;
		}
		if (msg.type === ServerMessageEvent.HostDisconnected) {
			connectionStateManager.setConnectionState("hostDisconnected");
			return;
		}
		if (msg.type === ServerMessageEvent.HostReconnected) {
			connectionStateManager.setConnectionState("connected");
			return;
		}
		if (msg.type === ServerMessageEvent.Close) {
			clearData();
			connectionStateElement.unmount();
			popupPageActions.sendUpdateConnectionState(null);
			sse?.close();
			sse = null;
			return;
		}
	});
	sse.addEventListener("error", () => {
		sse.close();
		isReconnecting = true;
		reconnectTry++;
		connectionStateManager.setConnectionState("reconnecting");
		if (reconnectTry > maxReconnectTries) {
			connectionStateManager.setConnectionState("disconnected");
			return;
		}
		reconnectTimeout = setTimeout(startSse, reconnectTry * 1000);
	});
};

const startWebsocket = async () => {
	const data = await getData();
	if (!isReconnecting) {
		connectionStateManager.setConnectionState("connecting");
	}
	connectionStateElement.mount();
	ws = new WebSocket(
		WEBSOCKET_URL + `/ws${data.reconnectKey ? `?reconnectKey=${data.reconnectKey}` : ""}`
	);
	ws.addEventListener("open", () => {
		connectionStateManager.setConnectionState("connected");
		isReconnecting = false;
		reconnectTry = 0;
		startSharing(ws);
	});
	ws.addEventListener("message", async (msg) => {
		const message = JSON.parse(msg.data);
		if (message.type === "reconnectKey") {
			await setData({ reconnectKey: message.key });
		}
		if (message.type === "code") {
			await setData({ joinCode: message.code });
			popupPageActions.sendCode(message.code);
		}
	});
	ws.addEventListener("close", closeWebsocket);
};

const cleanupWebsocket = () => {
	stopSharing();
	ws?.removeEventListener("close", closeWebsocket);
	ws?.close();
	ws = null;
};

const closeWebsocket = () => {
	stopSharing();
	isReconnecting = true;
	reconnectTry++;
	connectionStateManager.setConnectionState("reconnecting");
	if (reconnectTry > maxReconnectTries) {
		connectionStateManager.setConnectionState("disconnected");
		cleanupWebsocket();
		return;
	}
	ws = null;
	reconnectTimeout = setTimeout(startWebsocket, reconnectTry * 1000);
};

chrome.runtime.onMessage.addListener(async (message: ContentScriptEvent) => {
	if (message === ContentScriptEvent.StartReceiving) {
		startSse();
		return;
	}
	if (message === ContentScriptEvent.StartSharing) {
		startWebsocket();
		return;
	}
	if (message === ContentScriptEvent.StopReceiving) {
		sse?.close();
		sse = null;
		isReconnecting = false;
		reconnectTry = 0;
		clearTimeout(reconnectTimeout);
		connectionStateElement.unmount();
		return;
	}
	if (message === ContentScriptEvent.StopSharing) {
		try {
			ws?.send(JSON.stringify({ type: ServerMessageEvent.RemoveRoom }));
		} catch {}
		isReconnecting = false;
		reconnectTry = 0;
		clearTimeout(reconnectTimeout);
		cleanupWebsocket();
		connectionStateElement.unmount();
		return;
	}
	if (message === ContentScriptEvent.ChangeTab) {
		cleanupWebsocket();
		isReconnecting = false;
		reconnectTry = 0;
		clearTimeout(reconnectTimeout);
		connectionStateElement.unmount();
		return;
	}
	if (message === ContentScriptEvent.Reconnect) {
		const data = await getData();
		if (data.clientType === "sender") {
			startWebsocket();
			return;
		}
		if (data.clientType === "receiver") {
			startSse();
			return;
		}
	}
});

backgroundScriptActions.tabReady();
