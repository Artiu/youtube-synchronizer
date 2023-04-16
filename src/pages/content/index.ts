let video: HTMLVideoElement = document.querySelector(".video-stream");

window.addEventListener("yt-navigate-start", () => {
    console.log("New url:", location.href);
    cleanupListenersOnVideo();
    video = document.querySelector(".video-stream");
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
