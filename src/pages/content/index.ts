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
        if (msg.type === "newUrl") {
            changeUrl(msg.url);
            return;
        }
        if (msg.type === "rate-change") {
            changePlaybackRate(msg.playbackRate);
            return;
        }
        if (msg.type === "time") {
            setCurrentTimeInVideo(msg.time);
        }
    });
    port.onDisconnect.addListener(() => {
        stopSharing();
        stopClient();
    });
});
