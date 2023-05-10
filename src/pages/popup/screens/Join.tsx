import { Show, createSignal, onCleanup } from "solid-js";
import CodeInput from "../components/CodeInput";
import { joinCode, startReceiving } from "../store";

function Joined() {
    const copy = async () => {
        await navigator.clipboard.writeText(joinCode());
    };

    return (
        <>
            <p>
                You are currently connected to session with code{" "}
                <span class="font-bold">{joinCode()}</span>
            </p>
            <button class="btn btn-primary btn-sm" onClick={copy}>
                Copy
            </button>
        </>
    );
}

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
        <Show when={!joinCode()} fallback={<Joined />}>
            <CodeInput updateCode={updateCode} />
            <Show when={error()}>
                <p class="text-error">{error()}</p>
            </Show>
            <button class="btn" classList={{ loading: isLoading() }} onClick={join}>
                {isLoading() ? "Joining" : "Join"}
            </button>
        </Show>
    );
}
