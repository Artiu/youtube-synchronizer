import { Match, Show, Switch, createSignal, onCleanup } from "solid-js";
import { connectionState, joinCode, tabId } from "../store";
import { contentScriptActions } from "@src/pages/content/actions";

export default function SessionInfo() {
	const [canReconnect, setCanReconnect] = createSignal(true);
	let reconnectTimeout: NodeJS.Timeout;
	const reconnect = () => {
		setCanReconnect(false);
		contentScriptActions.reconnect(tabId());
		reconnectTimeout = setTimeout(() => setCanReconnect(true), 1000);
	};
	onCleanup(() => {
		clearTimeout(reconnectTimeout);
	});

	const copyCode = async () => {
		await navigator.clipboard.writeText(joinCode());
	};

	return (
		<>
			<div class="text-center">
				<p class="text-lg">
					<Switch>
						<Match when={connectionState() === "connected"}>Connected</Match>
						<Match when={connectionState() === "connecting"}>Connecting...</Match>
						<Match when={connectionState() === "reconnecting"}>Reconnecting...</Match>
						<Match when={connectionState() === "disconnected"}>Disconnected</Match>
						<Match when={connectionState() === "hostDisconnected"}>
							Host disconnected
						</Match>
					</Switch>
				</p>
				<Show when={connectionState() === "disconnected"}>
					<button
						class="btn btn-primary my-2 btn-sm"
						onClick={reconnect}
						disabled={!canReconnect()}
					>
						Reconnect
					</button>
				</Show>
				<p class="text-2xl font-bold">{joinCode()}</p>
			</div>
			<Show when={joinCode()}>
				<button class="btn btn-primary btn-sm" onClick={copyCode}>
					Copy
				</button>
			</Show>
		</>
	);
}
