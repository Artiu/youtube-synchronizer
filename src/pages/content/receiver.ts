import { getPlayingVideo } from "./utils";

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

export const isPathSame = (fullNewPath: string) => {
	const currentPath = location.pathname;
	const currentSearchParams = new URLSearchParams(location.search);
	const [newPath, newSearchParamsString] = fullNewPath.split("?");
	const newSearchParams = new URLSearchParams(newSearchParamsString);

	const isPathSame = newPath === currentPath;
	const isSearchParamSame = (name: string) => {
		return currentSearchParams.get(name) === newSearchParams.get(name);
	};
	const isVideoIdParamSame = isSearchParamSame("v");
	const isListIdParamSame = isSearchParamSame("list");
	const isSearchQueryParamsSame = isSearchParamSame("search_query");

	return isPathSame && isVideoIdParamSame && isListIdParamSame && isSearchQueryParamsSame;
};
