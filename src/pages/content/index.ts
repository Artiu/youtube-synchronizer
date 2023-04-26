import { setCurrentTimeInVideo } from "./receiver";
import {
    startClient,
    stopClient,
    playVideo,
    pauseVideo,
    changeUrl,
    changePlaybackRate,
} from "./receiver";
import { startSharing, stopSharing } from "./share";

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
        const messagesActions = {
            startSharing: () => startSharing(port.postMessage),
            stopSharing,
            startClient,
            stopClient,
        };

        if (typeof msg === "string") {
            messagesActions[msg]();
            return;
        }

        if (msg.type === "sync") {
            if (msg.isPaused) {
                pauseVideo();
            } else {
                playVideo();
            }
            setCurrentTimeInVideo(msg.time);
            changeUrl(msg.path);
            changePlaybackRate(msg.rate);
        }

        if (msg.type === "start-playing") {
            playVideo();
            setCurrentTimeInVideo(msg.time);
            return;
        }
        if (msg.type === "pause") {
            pauseVideo();
            setCurrentTimeInVideo(msg.time);
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
        stopClient();
    });
});
