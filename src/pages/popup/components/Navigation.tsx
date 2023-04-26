import { Setter } from "solid-js";
import { Screens } from "../Popup";

type NavigationProps = {
    locked: boolean;
    currentScreen: Screens;
    changeScreen: Setter<Screens>;
};

export default function Navigation(props: NavigationProps) {
    return (
        <div class="tabs tabs-boxed">
            <button
                class="tab"
                classList={{
                    "tab-active": props.currentScreen === "join",
                    "tab-disabled": props.locked,
                }}
                onClick={!props.locked ? () => props.changeScreen("join") : undefined}
            >
                Join
            </button>
            <button
                class="tab"
                classList={{
                    "tab-active": props.currentScreen === "create",
                    "tab-disabled": props.locked,
                }}
                onClick={!props.locked ? () => props.changeScreen("create") : undefined}
            >
                Create
            </button>
        </div>
    );
}
