import { updateCurrentTimeInVideo, setExactTimeInVideo } from "./receiver";
import { playVideo, pauseVideo, changeUrl, changePlaybackRate } from "./receiver";
import { startSharing, stopSharing } from "./share";

chrome.runtime.onConnect.addListener((port) => {
    const sendFunction = (message: any) => {
        port.postMessage(message);
    };
    port.onMessage.addListener((msg) => {
        if (msg === "startSharing") {
            startSharing(port);
            return;
        }

        if (msg.type === "sync") {
            changeUrl(msg.path, sendFunction);
            if (msg.isPaused) {
                pauseVideo();
            } else {
                playVideo();
            }
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
            changeUrl(msg.path, sendFunction);
            return;
        }
        if (msg.type === "rate-change") {
            changePlaybackRate(msg.rate);
            return;
        }
    });
    port.onDisconnect.addListener(() => {
        stopSharing();
    });
});

chrome.runtime.sendMessage({ type: "tabReady" });
