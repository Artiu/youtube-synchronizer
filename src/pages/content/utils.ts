export const getPlayingVideo = () => {
	return [...document.querySelectorAll(".video-stream")].filter(
		(el: HTMLVideoElement) => el.src
	)[0] as HTMLVideoElement;
};

export const waitForPlayingVideo = () => {
	return new Promise((resolve: (value: HTMLVideoElement) => void) => {
		const observer = new MutationObserver(() => {
			const video = getPlayingVideo();
			if (video) {
				observer.disconnect();
				resolve(video);
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });
		const video = getPlayingVideo();
		if (video) {
			observer.disconnect();
			resolve(video);
		}
	});
};

export const getYoutubePath = (url: string) => {
	return url.split("youtube.com")[1];
};

export const stripIndex = (fullYtPath: string) => {
	return fullYtPath.replace(/\&index=\d{1,}/, "");
};
