import { Show, createSignal, onCleanup } from "solid-js";
import CodeInput from "../components/CodeInput";
import { joinCode, startReceiving } from "../store";
import { PopupMessage, PopupPageEvent } from "../types";

export default function JoinScreen() {
	const [isLoading, setIsLoading] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);
	const [code, setCode] = createSignal("");
	const codeLength = 6;
	let isFirstTry = true;

	const handlePasteClick = async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (text) {
				updateCode(text.trim());
			}
		} catch (err) {
			console.error("Failed to read clipboard:", err);
		}
	};

	const updateCode = (newCode: string) => {
		setError(null);
		setCode(newCode.slice(0, codeLength));
		if (isFirstTry && newCode.length >= codeLength) {
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
		if (code().length < codeLength) return;
		setError(null);
		setIsLoading(true);
		startReceiving(code());
	};

	return (
		<Show when={!joinCode()}>
			<p class="text-2xl font-bold">Enter join code:</p>
			<div class="flex items-center gap-2">
				<CodeInput 
					code={code()}
					updateCode={updateCode} 
					codeLength={codeLength} 
					locked={isLoading()} 
				/>
				<button 
					class="btn btn-outline w-8 p-0" 
					title="Paste code" 
					disabled={isLoading()} 
					onClick={handlePasteClick}
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
				</button>
			</div>
			<Show when={error()}>
				<p class="text-error text-lg">{error()}</p>
			</Show>
			<button class="btn btn-primary" classList={{ loading: isLoading() }} onClick={join}>
				{isLoading() ? "Joining" : "Join"}
			</button>
		</Show>
	);
}
