import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { joinCode, startStreaming, tabId, updateTabId } from "../store";

export default function CreateScreen() {
    const [ytTabs, setYtTabs] = createSignal<chrome.tabs.Tab[]>([]);
    const [isLoading, setIsLoading] = createSignal(false);

    chrome.tabs.query({ url: "https://*.youtube.com/*" }, (tabs) => {
        setYtTabs(tabs);
    });

    const onMessage = (msg: any) => {
        if (msg.type === "ws-opened") {
            setIsLoading(false);
            return;
        }
        if (msg.type === "ws-closed") {
            setIsLoading(false);
            setSelectedTabId(null);
            return;
        }
    };

    chrome.runtime.onMessage.addListener(onMessage);

    onCleanup(() => chrome.runtime.onMessage.removeListener(onMessage));

    const copyCode = async () => {
        await navigator.clipboard.writeText(joinCode());
    };

    const [selectedTabId, setSelectedTabId] = createSignal<number>(null);
    const selectTab = (tabId: number) => {
        if (!selectedTabId()) {
            setIsLoading(true);
            startStreaming(tabId);
        } else {
            updateTabId(tabId);
        }
        setSelectedTabId(tabId);
    };

    createEffect(() => {
        setSelectedTabId(tabId());
    });

    return (
        <>
            <Show when={joinCode()}>
                <div>
                    <p class="text-lg">Code:</p>
                    <p class="text-2xl font-bold">{joinCode()}</p>
                </div>
                <button class="btn btn-primary btn-sm" onClick={copyCode}>
                    Copy
                </button>
            </Show>
            <h1 class="text-2xl font-bold">Choose tab to share: </h1>
            <div class="w-full grid grid-cols-[1fr_max-content] gap-x-3 gap-y-1 items-center">
                <For each={ytTabs()}>
                    {(item) => (
                        <>
                            <p class="text-[14px]">{item.title}</p>
                            <button
                                onClick={() => selectTab(item.id)}
                                class="btn btn-sm btn-primary"
                                classList={{
                                    "btn-disabled": selectedTabId() === item.id,
                                    loading: selectedTabId() === item.id && isLoading(),
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
