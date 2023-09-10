import { Show, createSignal, onCleanup } from "solid-js";
import CodeInput from "../components/CodeInput";
import { joinCode, startReceiving } from "../store";
import { PopupMessage, PopupPageEvent } from "../types";

export default function JoinScreen() {
	const [isLoading, setIsLoading] = createSignal(false);
	const [error, setError] = createSignal(null);
	let code = "";
	const codeLength = 6;
	let isFirstTry = true;

	const updateCode = (newCode: string) => {
		setError(null);
		code = newCode;
		if (isFirstTry && newCode.length === codeLength) {
			isFirstTry = false;
			join();
		}
	};

	const onMessage = (msg: PopupMessage) => {
		if (msg.type === PopupPageEvent.SseError) {
			setIsLoading(false);
			setError(msg.message);
			return;
		}
	};

	chrome.runtime.onMessage.addListener(onMessage);

	onCleanup(() => chrome.runtime.onMessage.removeListener(onMessage));

	const join = () => {
		if (code.length < codeLength) return;
		setError(null);
		setIsLoading(true);
		startReceiving(code);
	};

	return (
		<Show when={!joinCode()}>
			<p class="text-2xl font-bold">Enter join code:</p>
			<CodeInput updateCode={updateCode} codeLength={codeLength} locked={isLoading()} />
			<Show when={error()}>
				<p class="text-error text-lg">{error()}</p>
			</Show>
			<button class="btn btn-primary" classList={{ loading: isLoading() }} onClick={join}>
				{isLoading() ? "Joining" : "Join"}
			</button>
		</Show>
	);
}
