export enum PopupPageEvent {
    WsOpen,
    WsClosed,
    SseError,
    Code,
}

export type WsOpenMessage = { type: PopupPageEvent.WsOpen };
export type WsClosedMessage = { type: PopupPageEvent.WsClosed };
export type SseErrorMessage = { type: PopupPageEvent.SseError; message: string };
export type CodeMessage = { type: PopupPageEvent.Code; code: string };

export type PopupMessage = WsOpenMessage | WsClosedMessage | SseErrorMessage | CodeMessage;
