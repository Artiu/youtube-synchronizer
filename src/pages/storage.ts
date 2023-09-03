import { ClientType } from "./background/types";

type Data = { tabId: number; clientType: ClientType; joinCode: string; reconnectKey: string };

export const getData = () => {
	return chrome.storage.session.get([
		"tabId",
		"clientType",
		"joinCode",
		"reconnectKey",
	]) as Promise<Partial<Data>>;
};

export const setData = async (data: Partial<Data>) => {
	await chrome.storage.session.set(data);
};

export const clearData = async () => {
	await chrome.storage.session.remove(["tabId", "clientType", "joinCode"]);
};