import { backgroundScriptActions } from "../background/actions";
import { ServerMessageEvent } from "../serverMessage";
import { updateCurrentTimeInVideo, setExactTimeInVideo, isPathSame } from "./receiver";
import { playVideo, pauseVideo, changePlaybackRate } from "./receiver";
import { startSharing, stopSharing } from "./share";
import { ContentScriptEvent, ContentScriptMessage } from "./types";
import { stripIndex } from "./utils";

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg: ContentScriptMessage) => {
        if (msg.type === ContentScriptEvent.StartSharing) {
            startSharing(port);
            return;
        }

        if (msg.type === ServerMessageEvent.Sync) {
            const path = stripIndex(msg.path);
            if (!isPathSame(path)) {
                backgroundScriptActions.changePath(port, path);
            }
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
            backgroundScriptActions.changePath(port, msg.path);
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
