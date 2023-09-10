import { ConnectionState } from "../connectionState";
import { popupPageActions } from "../popup/actions";
import { setData } from "../storage";
import { ConnectionStateElement } from "./connectionStateElement";

export class ConnectionStateManager {
	constructor(private connectionStateElement: ConnectionStateElement) {}

	setConnectionState(connectionState: ConnectionState) {
		this.connectionStateElement.setConnectionState(connectionState);
		popupPageActions.sendUpdateConnectionState(connectionState);
		setData({ connectionState });
	}
}
