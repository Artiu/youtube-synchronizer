import { ServerMessage } from "../serverMessage";

export enum ContentScriptEvent {
    StartSharing,
}

export type StartSharingMessage = {
    type: ContentScriptEvent.StartSharing;
};

export type ContentScriptMessage = ServerMessage | StartSharingMessage;
