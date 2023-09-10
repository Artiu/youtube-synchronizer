import { ConnectionState } from "../connectionState";

export enum PopupPageEvent {
	UpdateConnectionState = "updateConnectionState",
	Code = "code",
	SseError = "sseError",
}

export type UpdateConnectionStateMessage = {
	type: PopupPageEvent.UpdateConnectionState;
	connectionState: ConnectionState;
};
export type CodeMessage = { type: PopupPageEvent.Code; code: string };
export type SseErrorMessage = { type: PopupPageEvent.SseError; message: string };

export type PopupMessage = CodeMessage | UpdateConnectionStateMessage | SseErrorMessage;
