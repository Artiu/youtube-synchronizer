import { getPlayingVideo } from "./utils";

let sendFunction: (message: any) => void;

let video: HTMLVideoElement;

const pauseEvent = () => {
    sendFunction({ type: "pause", time: video.currentTime });
};

const playingEvent = () => {
    sendFunction({ type: "start-playing", time: video.currentTime });
};

const rateChangeEvent = () => {
    sendFunction({ type: "rate-change", rate: video.playbackRate });
};

let intervalId: NodeJS.Timer;

const setupListenersOnVideo = () => {
    if (!video) return;
    video.addEventListener("pause", pauseEvent);
    video.addEventListener("waiting", pauseEvent);
    video.addEventListener("playing", playingEvent);
    video.addEventListener("ratechange", rateChangeEvent);

    intervalId = setInterval(() => {
        sendFunction({
            type: "sync",
            time: video.currentTime,
            isPaused: video.paused,
            path: location.href.split("youtube.com")[1],
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
    sendFunction({ type: "path-change", path: e.detail.url });
    cleanupListenersOnVideo();
    video = getPlayingVideo();
    setupListenersOnVideo();
};

export const startSharing = (sendFunc: (msg: any) => void) => {
    sendFunction = sendFunc;
    video = getPlayingVideo();
    setupListenersOnVideo();
    window.addEventListener("yt-navigate-start", onPageChange);
};

export const stopSharing = () => {
    cleanupListenersOnVideo();
    video = null;
    sendFunction = null;
    window.removeEventListener("yt-navigate-start", onPageChange);
};
