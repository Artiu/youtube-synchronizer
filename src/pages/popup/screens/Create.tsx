import { For, Show, createSignal, onCleanup } from "solid-js";
import { joinCode, startStreaming, tabId, updateTabId } from "../store";
import { PopupMessage, PopupPageEvent } from "../types";

export default function CreateScreen() {
	const [ytTabs, setYtTabs] = createSignal<chrome.tabs.Tab[]>([]);
	const [isLoading, setIsLoading] = createSignal(false);

	chrome.tabs.query({ url: "https://*.youtube.com/*" }, (tabs) => {
		setYtTabs(tabs);
	});

	const onMessage = (msg: PopupMessage) => {
		if (msg.type === PopupPageEvent.WsOpen || msg.type === PopupPageEvent.WsClosed) {
			setIsLoading(false);
			return;
		}
	};

	chrome.runtime.onMessage.addListener(onMessage);

	onCleanup(() => chrome.runtime.onMessage.removeListener(onMessage));

	const copyCode = async () => {
		await navigator.clipboard.writeText(joinCode());
	};

	const changeTab = (newId: number) => () => {
		if (tabId() === null) {
			setIsLoading(true);
			startStreaming(newId);
		} else {
			updateTabId(newId);
		}
	};

	return (
		<>
			<Show when={joinCode()}>
				<div class="text-center">
					<p class="text-lg">Code:</p>
					<p class="text-2xl font-bold">{joinCode()}</p>
				</div>
				<button class="btn btn-primary btn-sm" onClick={copyCode}>
					Copy
				</button>
			</Show>
			<h1 class="text-2xl font-bold">Choose tab to share: </h1>
			<div class="w-full grid grid-cols-[1fr_max-content] gap-x-3 gap-y-1 items-center">
				<For
					each={ytTabs()}
					fallback={<p class="text-base text-center">Open YouTube to start session</p>}
				>
					{(item) => (
						<>
							<p class="text-[14px]">{item.title}</p>
							<button
								onClick={changeTab(item.id)}
								class="btn btn-sm btn-primary"
								classList={{
									"btn-disabled": tabId() === item.id,
									loading: tabId() === item.id && isLoading(),
								}}
							>
								Select
							</button>
						</>
					)}
				</For>
			</div>
		</>
	);
}
