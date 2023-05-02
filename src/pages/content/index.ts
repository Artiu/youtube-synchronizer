import { setCurrentTimeInVideo } from "./receiver";
import {
    startReceiving,
    stopReceiving,
    playVideo,
    pauseVideo,
    changeUrl,
    changePlaybackRate,
} from "./receiver";
import { startSharing, stopSharing } from "./share";

console.log("Loaded extension");
chrome.runtime.onConnect.addListener((port) => {
    console.log(port);
    port.onMessage.addListener((msg) => {
        console.log(msg);
        const messagesActions = {
            startSharing: () => startSharing(port),
            startReceiving,
        };

        if (typeof msg === "string") {
            messagesActions[msg]();
            return;
        }

        if (msg.type === "sync") {
            console.log("Sync event", msg);
            changeUrl(msg.path);
            try {
                if (msg.isPaused) {
                    pauseVideo();
                } else {
                    playVideo();
                }
            } catch {}
            setCurrentTimeInVideo(msg.time);
            changePlaybackRate(msg.rate);
            return;
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
        console.log("Disconnected");
        stopSharing();
        stopReceiving();
    });
});
