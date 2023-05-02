export const getPlayingVideo = () => {
    return [...document.querySelectorAll(".video-stream")].filter(
        (el: HTMLVideoElement) => el.src
    )[0] as HTMLVideoElement;
};

export const getYoutubePath = (url: string) => {
    return url.split("youtube.com")[1];
};
