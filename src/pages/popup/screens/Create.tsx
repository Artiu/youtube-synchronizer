import { For, createSignal } from "solid-js"

export default function CreateScreen() {
    const [ytTabs, setYtTabs] = createSignal<chrome.tabs.Tab[]>([]);
    
    chrome.tabs.query({ url: "https://*.youtube.com/*"}, (tabs) => {
        setYtTabs(tabs);
    });

    return (
        <For each={ytTabs()}>
            {(item) => <p>{item.title} {item.url}</p>}
        </For>
    )
}