import { backgroundScriptActions } from "../background/actions";
import { ServerMessageEvent } from "../serverMessage";
import { updateCurrentTimeInVideo, setExactTimeInVideo } from "./receiver";
import { playVideo, pauseVideo, changeUrl, changePlaybackRate } from "./receiver";
import { startSharing, stopSharing } from "./share";
import { ContentScriptEvent, ContentScriptMessage } from "./types";

chrome.runtime.onConnect.addListener((port) => {
    const sendFunction = (message: any) => {
        port.postMessage(message);
    };
    port.onMessage.addListener((msg: ContentScriptMessage) => {
        if (msg.type === ContentScriptEvent.StartSharing) {
            startSharing(port);
            return;
        }

        if (msg.type === ServerMessageEvent.Sync) {
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

        if (msg.type === ServerMessageEvent.StartPlaying) {
            playVideo();
            setExactTimeInVideo(msg.time);
            return;
        }
        if (msg.type === ServerMessageEvent.Pause) {
            pauseVideo();
            setExactTimeInVideo(msg.time);
            return;
        }
        if (msg.type === ServerMessageEvent.PathChange) {
            changeUrl(msg.path, sendFunction);
            return;
        }
        if (msg.type === ServerMessageEvent.RateChange) {
            changePlaybackRate(msg.rate);
            return;
        }
    });
    port.onDisconnect.addListener(() => {
        stopSharing();
    });
});

backgroundScriptActions.tabReady();
