import { Show, createSignal, onCleanup } from "solid-js";
import CodeInput from "../components/CodeInput";
import { startReceiving } from "../store";

export default function JoinScreen() {
    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal(null);
    let code = "";

    const updateCode = (newCode: string) => {
        setError(null);
        code = newCode;
    };

    const onMessage = (msg: any) => {
        if (msg.type === "sse-error") {
            setIsLoading(false);
            setError(msg.message);
            return;
        }
    };

    chrome.runtime.onMessage.addListener(onMessage);

    onCleanup(() => chrome.runtime.onMessage.removeListener(onMessage));

    const join = () => {
        if (code.length < 6) return;
        setError(null);
        setIsLoading(true);
        startReceiving(code);
    };

    return (
        <>
            <CodeInput updateCode={updateCode} />
            <Show when={error()}>
                <p class="text-error">{error()}</p>
            </Show>
            <button class="btn" classList={{ loading: isLoading() }} onClick={join}>
                {isLoading() ? "Joining" : "Join"}
            </button>
        </>
    );
}
