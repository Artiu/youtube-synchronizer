export enum ServerMessageEvent {
    Sync = "sync",
    StartPlaying = "startPlaying",
    Pause = "pause",
    PathChange = "pathChange",
    RateChange = "rateChange",
}

export type SyncMessage = {
    type: ServerMessageEvent.Sync;
    path: string;
    isPaused: boolean;
    time: number;
    rate: number;
};

export type StartPlayingMessage = {
    type: ServerMessageEvent.StartPlaying;
    time: number;
};

export type PauseMessage = {
    type: ServerMessageEvent.Pause;
    time: number;
};

export type PathChangeMessage = {
    type: ServerMessageEvent.PathChange;
    path: string;
};

export type RateChangeMessage = {
    type: ServerMessageEvent.RateChange;
    rate: number;
};

export type ServerMessage =
    | SyncMessage
    | StartPlayingMessage
    | PauseMessage
    | PathChangeMessage
    | RateChangeMessage;

export const sendServerMessage = (port: chrome.runtime.Port, message: ServerMessage) => {
    port.postMessage(message);
};
