import { Show, createEffect, createSignal } from "solid-js";
import Navigation from "./components/Navigation";
import JoinScreen from "./screens/Join";
import { Dynamic } from "solid-js/web";
import CreateScreen from "./screens/Create";
import { clientType } from "./store";

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

    return (
        <div class="w-[400px]">
            <Navigation currentScreen={screen()} changeScreen={setScreen} locked={!!clientType()} />
            <div class="px-5 py-2">
                <Dynamic component={screens[screen()]} />
            </div>
            <Show when={!!clientType()}>
                <button class="btn btn-error">Stop</button>
            </Show>
            <a href="https://ko-fi.com/Z8Z0KABI5" target="_blank">
                <img
                    height="36"
                    style="border:0px;height:36px;"
                    src="https://storage.ko-fi.com/cdn/kofi4.png?v=3"
                    alt="Buy Me a Coffee at ko-fi.com"
                />
            </a>
        </div>
    );
};

export default Popup;
