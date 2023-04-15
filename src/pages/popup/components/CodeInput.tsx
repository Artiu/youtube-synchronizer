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
            focusInput(index + 1);
        }
    };

    const getCodeFromClipboard = async () => {
        const el = document.createElement("input");
        document.body.appendChild(el);
        el.focus();
        document.execCommand("paste");
        const content = el.value;
        document.body.removeChild(el);
        inputs.forEach((input, index) => {
            input.value = content[index] || "";
        });
        props.updateCode(getCode());
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
