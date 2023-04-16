const getPlayingVideo = () => {
    return [...document.querySelectorAll(".video-stream")].filter(
        (el: HTMLVideoElement) => el.src
    )[0] as HTMLVideoElement;
};

let video: HTMLVideoElement = getPlayingVideo();

window.addEventListener("yt-navigate-start", (e: any) => {
    console.log("New url:", e.detail.url);
    cleanupListenersOnVideo();
    video = getPlayingVideo();
    setupListenersOnVideo();
});

const pauseEvent = () => {
    console.log("Paused");
};

const playingEvent = () => {
    console.log("Playing");
};

const rateChangeEvent = () => {
    console.log("Rate changed to: ", video.playbackRate);
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

setupListenersOnVideo();
