import { For, createSignal } from "solid-js";
import { startStreaming, tabId } from "../store";

export default function CreateScreen() {
	const [ytTabs, setYtTabs] = createSignal<chrome.tabs.Tab[]>([]);

	chrome.tabs.query({ url: "https://*.youtube.com/*" }, (tabs) => {
		setYtTabs(tabs);
	});

	const startSharing = (newId: number) => () => {
		startStreaming(newId);
	};

	return (
		<>
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
								onClick={startSharing(item.id)}
								class="btn btn-sm btn-primary"
								classList={{
									"btn-disabled": tabId() === item.id,
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
