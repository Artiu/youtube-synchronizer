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

let sse: EventSource = null;
let ws: WebSocket = null;
const connectionStateElement = new ConnectionStateElement();

const cleanupWebsocket = () => {
	stopSharing();
	ws?.removeEventListener("close", cleanupWebsocket);
	ws?.close();
	ws = null;
};

chrome.runtime.onMessage.addListener(async (message: ContentScriptEvent) => {
	const data = await getData();
	if (message === ContentScriptEvent.StartReceiving) {
		connectionStateElement.setConnectionState("connecting");
		connectionStateElement.mount();
		sse = new EventSource(BACKEND_URL + "/room/" + data.joinCode);
		sse.addEventListener("open", () => {
			connectionStateElement.setConnectionState("connected");
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
			if (msg.type === ServerMessageEvent.Close) {
				clearData();
				sse?.close();
				sse = null;
				return;
			}
		});
		sse.addEventListener("error", () => {
			connectionStateElement.setConnectionState("disconnected");
			popupPageActions.sendSseError("Something went wrong!");
		});
		return;
	}
	if (message === ContentScriptEvent.StartSharing) {
		connectionStateElement.setConnectionState("connecting");
		connectionStateElement.mount();
		ws = new WebSocket(
			WEBSOCKET_URL + `/ws${data.reconnectKey ? `?reconnectKey=${data.reconnectKey}` : ""}`
		);
		ws.addEventListener("open", () => {
			connectionStateElement.setConnectionState("connected");
			popupPageActions.sendWsOpen();
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
		ws.addEventListener("close", () => {
			connectionStateElement.setConnectionState("disconnected");
			cleanupWebsocket();
		});
		return;
	}
	if (message === ContentScriptEvent.StopReceiving) {
		sse?.close();
		sse = null;
		connectionStateElement.unmount();
		return;
	}
	if (message === ContentScriptEvent.StopSharing) {
		ws.send(JSON.stringify({ type: ServerMessageEvent.RemoveRoom }));
		cleanupWebsocket();
		connectionStateElement.unmount();
		return;
	}
	if (message === ContentScriptEvent.ChangeTab) {
		cleanupWebsocket();
		connectionStateElement.unmount();
		return;
	}
});

backgroundScriptActions.tabReady();
