import { getPlayingVideo, getYoutubePath } from "./utils";

export const playVideo = async () => {
    const video = getPlayingVideo();
    try {
        await video.play();
    } catch (err) {
        console.error(err);
    }
};

export const pauseVideo = () => {
    const video = getPlayingVideo();
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

export const changeUrl = (path: string, sendFunction: (message: any) => void) => {
    path = stripIndex(path);
    if (stripIndex(getYoutubePath(location.href)) === path) return;
    sendFunction({ type: "changePath", path });
};
