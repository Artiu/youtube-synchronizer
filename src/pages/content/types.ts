export enum ContentScriptEvent {
	StartSharing = "start-sharing",
	StartReceiving = "start-receiving",
	StopSharing = "stop-sharing",
	StopReceiving = "stop-receiving",
}

export type StartSharingMessage = {
	type: ContentScriptEvent.StartSharing;
};

export type ContentScriptMessage = StartSharingMessage;
