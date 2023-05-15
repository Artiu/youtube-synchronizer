import { Show, createEffect, createSignal } from "solid-js";
import Navigation from "./components/Navigation";
import JoinScreen from "./screens/Join";
import { Dynamic } from "solid-js/web";
import CreateScreen from "./screens/Create";
import { clientType, stopStreaming } from "./store";

export type Screens = keyof typeof screens;

const screens = {
    join: JoinScreen,
    create: CreateScreen,
};

const Popup = () => {
    const [screen, setScreen] = createSignal<Screens>("join");

    createEffect(() => {
        if (!clientType()) return;
        if (clientType() === "receiver") {
            setScreen("join");
        } else {
            setScreen("create");
        }
    });

    const shouldBeLocked = () => !!clientType();

    return (
        <div class="w-[400px]">
            <Navigation
                currentScreen={screen()}
                changeScreen={setScreen}
                locked={shouldBeLocked()}
            />
            <div class="px-5 py-2">
                <div class="flex flex-col items-center gap-2">
                    <Dynamic component={screens[screen()]} />
                    <Show when={clientType()}>
                        <button class="btn btn-error" onClick={stopStreaming}>
                            Stop
                        </button>
                    </Show>
                </div>
                <div class="mt-8 w-fit mx-auto">
                    <a href="https://ko-fi.com/Z8Z0KABI5" target="_blank">
                        <img
                            height="36"
                            style="border:0px;height:36px;"
                            src="https://storage.ko-fi.com/cdn/kofi1.png?v=3"
                            alt="Buy Me a Coffee at ko-fi.com"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Popup;
