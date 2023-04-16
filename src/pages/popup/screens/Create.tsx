import { For, createSignal } from "solid-js";

export default function CreateScreen() {
    const [ytTabs, setYtTabs] = createSignal<chrome.tabs.Tab[]>([]);

    chrome.tabs.query({ url: "https://*.youtube.com/*" }, (tabs) => {
        setYtTabs(tabs);
    });

    const [code, setCode] = createSignal("test");

    const copyCode = async () => {
        await navigator.clipboard.writeText(code());
    };

    const [selectedTabId, setSelectedTabId] = createSignal<number>(null);

    const selectTab = (tabId: number) => {
        setSelectedTabId(tabId);
    };

    const [remainingCodeLifetime, setRemainingCodeLifetime] = createSignal(120);
    const intervalId = setInterval(() => {
        if (remainingCodeLifetime() < 1) {
            clearInterval(intervalId);
            return;
        }
        setRemainingCodeLifetime(remainingCodeLifetime() - 1);
    }, 1000);

    return (
        <>
            <p class="text-lg">Code:</p>
            <p class="text-2xl font-bold">{code()}</p>
            <button class="btn btn-primary btn-sm" onClick={copyCode}>
                Copy
            </button>
            <p>{remainingCodeLifetime()}s</p>
            <progress
                class="progress progress-primary"
                value={remainingCodeLifetime()}
                max={120}
            ></progress>
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
