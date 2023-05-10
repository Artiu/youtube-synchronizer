import { updateCurrentTimeInVideo, setExactTimeInVideo } from "./receiver";
import {
    startReceiving,
    stopReceiving,
    playVideo,
    pauseVideo,
    changeUrl,
    changePlaybackRate,
} from "./receiver";
import { startSharing, stopSharing } from "./share";

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
        const messagesActions = {
            startSharing: () => startSharing(port),
            startReceiving,
        };

        if (typeof msg === "string") {
            messagesActions[msg]();
            return;
        }

        if (msg.type === "sync") {
            changeUrl(msg.path);
            try {
                if (msg.isPaused) {
                    pauseVideo();
                } else {
                    playVideo();
                }
            } catch {}
            updateCurrentTimeInVideo(msg.time);
            changePlaybackRate(msg.rate);
            return;
        }

        if (msg.type === "start-playing") {
            playVideo();
            setExactTimeInVideo(msg.time);
            return;
        }
        if (msg.type === "pause") {
            pauseVideo();
            setExactTimeInVideo(msg.time);
            return;
        }
        if (msg.type === "path-change") {
            changeUrl(msg.path);
            return;
        }
        if (msg.type === "rate-change") {
            changePlaybackRate(msg.rate);
            return;
        }
    });
    port.onDisconnect.addListener(() => {
        stopSharing();
        stopReceiving();
    });
});
