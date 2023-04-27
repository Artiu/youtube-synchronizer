import { For, Show, createEffect, createSignal } from "solid-js";
import { joinCode, tabId } from "../store";

export default function CreateScreen() {
    const [ytTabs, setYtTabs] = createSignal<chrome.tabs.Tab[]>([]);

    chrome.tabs.query({ url: "https://*.youtube.com/*" }, (tabs) => {
        setYtTabs(tabs);
    });

    const copyCode = async () => {
        await navigator.clipboard.writeText(joinCode());
    };

    const [selectedTabId, setSelectedTabId] = createSignal<number>(null);
    const selectTab = (tabId: number) => {
        setSelectedTabId(tabId);
        chrome.runtime.sendMessage({ type: "startSharing", tabId });
    };

    createEffect(() => {
        setSelectedTabId(tabId());
    });

    return (
        <>
            <Show when={joinCode()}>
                <p class="text-lg">Code:</p>
                <p class="text-2xl font-bold">{joinCode()}</p>
                <button class="btn btn-primary btn-sm" onClick={copyCode}>
                    Copy
                </button>
            </Show>
            <h1 class="text-2xl font-bold">Choose tab to share: </h1>
            <div class="grid grid-cols-[1fr_max-content] gap-x-3 gap-y-1 items-center">
                <For each={ytTabs()}>
                    {(item) => (
                        <>
                            <p class="text-[14px]">{item.title}</p>
                            <button
                                onClick={() => selectTab(item.id)}
                                class="btn btn-sm btn-primary"
                                classList={{ "btn-disabled": selectedTabId() === item.id }}
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
