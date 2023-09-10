import { JSX, Show } from "solid-js";
import Navigation from "./components/Navigation";
import JoinScreen from "./screens/Join";
import { Dynamic } from "solid-js/web";
import CreateScreen from "./screens/Create";
import { clientType, isLocked, stopStreaming } from "./store";
import { ClientType } from "../background/types";
import SessionInfo from "./components/SessionInfo";

const clientTypeToScreens: Record<ClientType, () => JSX.Element> = {
	receiver: JoinScreen,
	sender: CreateScreen,
};

const Popup = () => {
	return (
		<div class="w-[400px]">
			<Navigation />
			<div class="px-5 py-2">
				<div class="flex flex-col items-center gap-2">
					<SessionInfo />
					<Dynamic component={clientTypeToScreens[clientType()]} />
					<Show when={isLocked()}>
						<button class="btn btn-error" onClick={stopStreaming}>
							Stop
						</button>
					</Show>
				</div>
				<div class="mt-8 w-fit mx-auto">
					<a href="https://ko-fi.com/Z8Z0KABI5" target="_blank">
						<img
							height="36"
							style="border:0px;height:36px;"
							src="https://storage.ko-fi.com/cdn/kofi1.png?v=3"
							alt="Buy Me a Coffee at ko-fi.com"
						/>
					</a>
				</div>
			</div>
		</div>
	);
};

export default Popup;
