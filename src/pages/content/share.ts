import { ServerMessage, ServerMessageEvent, sendServerMessage } from "../serverMessage";
import { getPlayingVideo, getYoutubePath } from "./utils";

let backgroundScript: chrome.runtime.Port;

let video: HTMLVideoElement;

const sendMessage = (message: ServerMessage) => {
    sendServerMessage(backgroundScript, message);
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

const onPageChange = (e: any) => {
    sendMessage({ type: ServerMessageEvent.PathChange, path: e.detail.url });
    cleanupListenersOnVideo();
    video = getPlayingVideo();
    setupListenersOnVideo();
};

export const startSharing = (bs: chrome.runtime.Port) => {
    backgroundScript = bs;
    video = getPlayingVideo();
    setupListenersOnVideo();
    window.addEventListener("yt-navigate-start", onPageChange);
};

export const stopSharing = () => {
    cleanupListenersOnVideo();
    video = null;
    backgroundScript = null;
    window.removeEventListener("yt-navigate-start", onPageChange);
};
