import { getPlayingVideo } from "./utils";

let video: HTMLVideoElement;

const onUrlChange = () => {};

export const startClient = () => {
    video = getPlayingVideo();
    // window.addEventListener("yt-navigate-start", onUrlChange);
};

export const stopClient = () => {
    video = null;
};

export const playVideo = () => {
    video.play();
};

export const pauseVideo = () => {
    video.pause();
};

export const changePlaybackRate = (newPlaybackRate: number) => {
    video.playbackRate = newPlaybackRate;
};

export const setCurrentTimeInVideo = (newTime: number) => {
    if (newTime - video.currentTime < 0.5) return;
    video.currentTime = newTime;
};

//change to popstate or something similar
export const changeUrl = (path: string) => {
    location.href = "https://www.youtube.com" + path;
};
