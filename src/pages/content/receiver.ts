import { getPlayingVideo, getYoutubePath, stripIndex } from "./utils";

export const playVideo = async () => {
	const video = getPlayingVideo();
	try {
		await video?.play();
	} catch {}
};

export const pauseVideo = () => {
	const video = getPlayingVideo();
	video?.pause();
};

export const changePlaybackRate = (newPlaybackRate: number) => {
	const video = getPlayingVideo();
	if (!video) return;
	video.playbackRate = newPlaybackRate;
};

export const setExactTimeInVideo = (newTime: number) => {
	const video = getPlayingVideo();
	if (!video) return;
	video.currentTime = newTime;
};

export const updateCurrentTimeInVideo = (newTime: number) => {
	const video = getPlayingVideo();
	if (!video) return;
	if (newTime - video.currentTime < 0.5) return;
	video.currentTime = newTime;
};

export const isPathSame = (strippedPath: string) => {
	return stripIndex(getYoutubePath(location.href)) === strippedPath;
};
