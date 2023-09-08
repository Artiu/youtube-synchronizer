export class ConnectionStateElement {
	private element: HTMLParagraphElement;

	constructor() {
		this.element = document.createElement("p");
		this.element.style.position = "fixed";
		this.element.style.bottom = "0px";
		this.element.style.left = "50%";
		this.element.style.transform = "translateX(-50%)";
		this.element.style.fontSize = "18px";
		this.element.style.borderInline = "1px";
		this.element.style.borderTop = "1px";
		this.element.style.borderColor = "black";
		this.element.style.borderStyle = "solid";
		this.element.style.padding = "10px";
		this.element.style.background = "rgba(255, 255, 255, 0.8)";
	}

	private updateText(newText: string) {
		this.element.textContent = newText;
	}

	setConnectionState(state: "connecting" | "connected" | "reconnecting" | "disconnected") {
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
	}

	mount() {
		document.body.appendChild(this.element);
	}
	unmount() {
		document.body.removeChild(this.element);
	}
}
