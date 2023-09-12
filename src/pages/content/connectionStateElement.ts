import { ConnectionState } from "../connectionState";

export class ConnectionStateElement {
	private container: HTMLDivElement;
	private textElement: HTMLParagraphElement;
	private closeButton: HTMLButtonElement;
	private isMounted = false;

	constructor() {
		const isDarkMode = document.documentElement.hasAttribute("dark");
		this.container = document.createElement("div");
		this.container.style.position = "fixed";
		this.container.style.bottom = "0px";
		this.container.style.left = "50%";
		this.container.style.transform = "translateX(-50%)";
		this.container.style.fontSize = "1.4rem";
		this.container.style.padding = "10px";
		this.container.style.background = isDarkMode ? "rgb(37, 37, 37)" : "rgb(242, 242, 242);";
		this.container.style.border = "2px solid rgb(30, 30, 30)";
		this.container.style.borderColor = isDarkMode ? "rgb(30, 30, 30)" : "rgb(250, 250, 250)";
		this.container.style.borderBottomWidth = "0px";
		this.container.style.color = isDarkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)";
		this.container.style.borderRadius = "12px 12px 0 0";
		this.container.style.display = "flex";
		this.container.style.alignItems = "center";
		this.container.style.gap = "10px";
		this.textElement = document.createElement("p");
		this.closeButton = document.createElement("button");
		this.closeButton.textContent = "x";
		this.closeButton.style.border = "1px solid rgb(255, 255, 255)";
		this.closeButton.style.borderColor = isDarkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)";
		this.closeButton.style.borderRadius = "50%";
		this.closeButton.style.lineHeight = "normal";
		this.closeButton.style.color = "inherit";
		this.closeButton.style.font = "inherit";
		this.closeButton.style.fontSize = "1.2rem";
		this.closeButton.style.background = "transparent";
		this.closeButton.style.cursor = "pointer";
		this.closeButton.addEventListener("click", () => this.unmount());
		this.container.appendChild(this.textElement);
		this.container.appendChild(this.closeButton);
	}

	private updateText(newText: string) {
		this.textElement.textContent = newText;
	}

	setConnectionState(state: ConnectionState) {
		if (state === "connecting") {
			this.updateText("Connecting...");
			return;
		}
		if (state === "connected") {
			this.updateText("You're connected!");
			return;
		}
		if (state === "reconnecting") {
			this.updateText("Reconnecting...");
			return;
		}
		if (state === "disconnected") {
			this.updateText("Disconnected");
			return;
		}
		if (state === "hostDisconnected") {
			this.updateText("Host disconnected");
			return;
		}
		if (state === "roomClosed") {
			this.updateText("Session ended");
			return;
		}
	}

	mount() {
		if (this.isMounted) return;
		this.isMounted = true;
		document.body.appendChild(this.container);
	}
	unmount() {
		if (!this.isMounted) return;
		this.isMounted = false;
		document.body.removeChild(this.container);
	}
}
