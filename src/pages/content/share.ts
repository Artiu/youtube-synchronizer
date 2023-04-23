import { getPlayingVideo } from "./utils";

let sendFunction: (message: any) => void;

let video: HTMLVideoElement;

const pauseEvent = () => {
    console.log("Paused");
    sendFunction({ type: "pause", time: video.currentTime });
};

const playingEvent = () => {
    console.log("Playing");
    sendFunction({ type: "start-playing", time: video.currentTime });
};

const rateChangeEvent = () => {
    console.log("Rate changed to: ", video.playbackRate);
    sendFunction({ type: "rate-change", playbackRate: video.playbackRate });
};

let intervalId: NodeJS.Timer;

const setupListenersOnVideo = () => {
    if (!video) return;
    video.addEventListener("pause", pauseEvent);
    video.addEventListener("waiting", pauseEvent);
    video.addEventListener("playing", playingEvent);
    video.addEventListener("ratechange", rateChangeEvent);

    intervalId = setInterval(() => {
        if (video.paused) return;
        console.log("Current time: ", video.currentTime);
        sendFunction({ type: "time", time: video.currentTime });
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
    console.log("New url:", e.detail.url);
    sendFunction({ type: "newUrl", url: e.detail.url });
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
