import { ClientType } from "./background/types";
import { ConnectionState } from "./connectionState";

type Data = {
	tabId: number;
	clientType: ClientType;
	joinCode: string;
	reconnectKey: string;
	connectionState: ConnectionState;
};

export const getData = () => {
	return chrome.storage.session.get([
		"tabId",
		"clientType",
		"joinCode",
		"reconnectKey",
		"connectionState",
	]) as Promise<Partial<Data>>;
};

export const setData = async (data: Partial<Data>) => {
	await chrome.storage.session.set(data);
};

export const clearData = async () => {
	await chrome.storage.session.remove(["tabId", "clientType", "joinCode", "connectionState"]);
};

export const clearReconnectKey = async () => {
	await chrome.storage.session.remove("reconnectKey");
};
