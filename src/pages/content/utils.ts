export const getPlayingVideo = () => {
    return [...document.querySelectorAll(".video-stream")].filter(
        (el: HTMLVideoElement) => el.src
    )[0] as HTMLVideoElement;
};
