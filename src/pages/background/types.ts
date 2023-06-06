export enum BackgroundScriptEvent {
    InitialPopupData,
    StartSharing,
    ChangeTab,
    StartReceiving,
    TabReady,
    Stop,
    PathChange,
}

export type InitialPopupDataMessage = {
    type: BackgroundScriptEvent.InitialPopupData;
};

export type StartSharingMessage = {
    type: BackgroundScriptEvent.StartSharing;
    tabId: number;
};

export type ChangeTabMessage = {
    type: BackgroundScriptEvent.ChangeTab;
    tabId: number;
};

export type StartReceivingMessage = {
    type: BackgroundScriptEvent.StartReceiving;
    joinCode: string;
};

export type TabReadyMessage = {
    type: BackgroundScriptEvent.TabReady;
};

export type StopMessage = {
    type: BackgroundScriptEvent.Stop;
};

export type PathChangeMessage = {
    type: BackgroundScriptEvent.PathChange;
    path: string;
};

export type BackgroundScriptMessage =
    | InitialPopupDataMessage
    | StartSharingMessage
    | ChangeTabMessage
    | StartReceivingMessage
    | TabReadyMessage
    | StopMessage;

export type InitialPopupData = {
    tabId: number;
    clientType: ClientType;
    joinCode: string;
};

export type ClientType = "receiver" | "sender";
