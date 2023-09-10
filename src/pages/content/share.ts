import { ServerMessage, ServerMessageEvent } from "../serverMessage";
import { getYoutubePath, waitForPlayingVideo } from "./utils";

let websocket: WebSocket;
let video: HTMLVideoElement;
let isStopped = true;

const sendMessage = (message: ServerMessage) => {
	try {
		websocket?.send(JSON.stringify(message));
	} catch {}
};

const pauseEvent = () => {
	sendMessage({
		type: ServerMessageEvent.Pause,
		time: video.currentTime,
	});
};

const playingEvent = () => {
	sendMessage({ type: ServerMessageEvent.StartPlaying, time: video.currentTime });
};

const rateChangeEvent = () => {
	sendMessage({ type: ServerMessageEvent.RateChange, rate: video.playbackRate });
};

let intervalId: NodeJS.Timer;

const setupListenersOnVideo = () => {
	if (!video) return;
	video.addEventListener("pause", pauseEvent);
	video.addEventListener("waiting", pauseEvent);
	video.addEventListener("playing", playingEvent);
	video.addEventListener("ratechange", rateChangeEvent);

	sendMessage({
		type: ServerMessageEvent.Sync,
		time: video.currentTime,
		isPaused: video.paused,
		path: getYoutubePath(location.href),
		rate: video.playbackRate,
	});
	intervalId = setInterval(() => {
		sendMessage({
			type: ServerMessageEvent.Sync,
			time: video.currentTime,
			isPaused: video.paused,
			path: getYoutubePath(location.href),
			rate: video.playbackRate,
		});
	}, 3000);
};

const cleanupListenersOnVideo = () => {
	if (!video) return;
	video.removeEventListener("pause", pauseEvent);
	video.removeEventListener("waiting", pauseEvent);
	video.removeEventListener("playing", playingEvent);
	video.removeEventListener("ratechange", rateChangeEvent);
	clearInterval(intervalId);
};

const onPageChangeStart = (e: any) => {
	sendMessage({ type: ServerMessageEvent.PathChange, path: e.detail.url });
};

const onPageChangeFinish = async () => {
	const newVideo = await waitForPlayingVideo();
	if (isStopped) {
		return;
	}
	cleanupListenersOnVideo();
	video = newVideo;
	setupListenersOnVideo();
};

export const startSharing = async (ws: WebSocket) => {
	websocket = ws;
	isStopped = false;
	sendMessage({ type: ServerMessageEvent.PathChange, path: getYoutubePath(location.href) });
	video = await waitForPlayingVideo();
	if (isStopped) {
		return;
	}
	window.addEventListener("yt-navigate-start", onPageChangeStart);
	window.addEventListener("yt-navigate-finish", onPageChangeFinish);
	setupListenersOnVideo();
};

export const stopSharing = () => {
	cleanupListenersOnVideo();
	isStopped = true;
	video = null;
	websocket = null;
	window.removeEventListener("yt-navigate-start", onPageChangeStart);
	window.removeEventListener("yt-navigate-finish", onPageChangeFinish);
};
