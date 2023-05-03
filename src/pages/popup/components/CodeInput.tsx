import { For } from "solid-js";

const CODE_LENGTH = 6;

type CodeInputProps = {
    updateCode: (newCode: string) => void;
};

export default function CodeInput(props: CodeInputProps) {
    let inputs: HTMLInputElement[] = [];
    const getCode = () => {
        return inputs.reduce((prev, current) => prev + current.value, "") as string;
    };

    const focusInput = (index: number) => {
        const input = inputs[index];
        if (!input) return;
        input.focus();
    };

    const onInput = (index: number) => () => {
        props.updateCode(getCode());
        if (inputs[index].value.length === 0) {
            if (inputs.slice(index + 1).every((input) => input.value === "")) {
                focusInput(index - 1);
            }
            return;
        }
        focusInput(index + 1);
    };

    const onBeforeInput = (index: number) => (e: InputEvent) => {
        if (
            (e.currentTarget as HTMLInputElement).value.length === 1 &&
            e.inputType !== "deleteContentBackward"
        ) {
            e.preventDefault();
            (e.currentTarget as HTMLInputElement).value = e.data;
            props.updateCode(getCode());
            focusInput(index + 1);
        }
    };

    const changeText = (newText: string) => {
        inputs.forEach((input, index) => {
            input.value = newText[index] || "";
        });
        props.updateCode(getCode());
    };

    const onPaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const content = e.clipboardData.getData("Text");
        changeText(content);
    };

    const getCodeFromClipboard = () => {
        const el = document.createElement("input");
        document.body.appendChild(el);
        el.focus();
        document.execCommand("paste");
        changeText(el.value);
        document.body.removeChild(el);
    };

    return (
        <>
            <div class="flex gap-2">
                <For each={new Array(CODE_LENGTH)}>
                    {(_, index) => (
                        <input
                            class="input input-bordered w-8 text-center p-0"
                            ref={(el) => inputs.push(el)}
                            onBeforeInput={onBeforeInput(index())}
                            onInput={onInput(index())}
                            onPaste={onPaste}
                            autofocus={index() === 0}
                        />
                    )}
                </For>
            </div>
            <button class="btn" onClick={getCodeFromClipboard}>
                Paste
            </button>
        </>
    );
}
