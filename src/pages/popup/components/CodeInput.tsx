import { For } from "solid-js";

const CODE_LENGTH = 6;

export default function CodeInput() {
    let inputs: HTMLInputElement[] = [];
    const getCode = () => {
        return inputs.reduce((prev, current) => prev + current.value, "") as string;
    }

    const onInput = (index: number) => (e: Event) => {
        if(inputs[index].value === "") {
            return;
        }
        const nextInput = inputs[index];
        if(!nextInput) {
            e.preventDefault();
            return;
        }
        nextInput.focus();
    }

    return (
        <div class="flex">
            <For each={new Array(CODE_LENGTH)}> 
                {(_, index) => <input class="input input-bordered w-4" ref={el => inputs.push(el)} onInput={onInput(index())} />}
            </For>
        </div>
    )
}