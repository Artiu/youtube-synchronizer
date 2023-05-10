import { getPlayingVideo, getYoutubePath } from "./utils";

export const startReceiving = () => {};

export const stopReceiving = () => {};

export const playVideo = () => {
    const video = getPlayingVideo();
    if (!video.paused) return;
    video.play();
};

export const pauseVideo = () => {
    const video = getPlayingVideo();
    if (video.paused) return;
    video.pause();
};

export const changePlaybackRate = (newPlaybackRate: number) => {
    const video = getPlayingVideo();
    video.playbackRate = newPlaybackRate;
};

export const setExactTimeInVideo = (newTime: number) => {
    const video = getPlayingVideo();
    video.currentTime = newTime;
};

export const updateCurrentTimeInVideo = (newTime: number) => {
    const video = getPlayingVideo();
    if (newTime - video.currentTime < 0.5) return;
    video.currentTime = newTime;
};

const stripIndex = (fullYtPath: string) => {
    return fullYtPath.replace(/\&index=\d{1,}/, "");
};

export const changeUrl = (path: string) => {
    path = stripIndex(path);
    console.log(path, stripIndex(getYoutubePath(location.href)));
    if (stripIndex(getYoutubePath(location.href)) === path) return;
    const actualCode = `const logo = document.querySelector("#logo a"); 
    const data = logo.data;
    logo.data = {
        commandMetadata: {
            webCommandMetadata: {
                url: "${path}",
            },
        },
    };
    logo.click();
    logo.data = data;`;

    document.documentElement.setAttribute("onreset", actualCode);
    document.documentElement.dispatchEvent(new CustomEvent("reset"));
    document.documentElement.removeAttribute("onreset");
};
