export enum PopupPageEvent {
	WsOpen = "ws-open",
	WsClosed = "ws-closed",
	SseError = "sse-error",
	Code = "code",
}

export type WsOpenMessage = { type: PopupPageEvent.WsOpen };
export type WsClosedMessage = { type: PopupPageEvent.WsClosed };
export type SseErrorMessage = { type: PopupPageEvent.SseError; message: string };
export type CodeMessage = { type: PopupPageEvent.Code; code: string };

export type PopupMessage = WsOpenMessage | WsClosedMessage | SseErrorMessage | CodeMessage;
