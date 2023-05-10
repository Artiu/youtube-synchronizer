import { Setter } from "solid-js";
import { Screens } from "../Popup";

type NavigationProps = {
    locked: boolean;
    currentScreen: Screens;
    changeScreen: Setter<Screens>;
};

export default function Navigation(props: NavigationProps) {
    const changeScreen = (name: Screens) => () => {
        if (props.locked) return;
        props.changeScreen(name);
    };

    return (
        <div class="tabs tabs-boxed">
            <button
                class="tab"
                classList={{
                    "tab-active": props.currentScreen === "join",
                    "tab-disabled": props.locked,
                }}
                onClick={changeScreen("join")}
            >
                Join
            </button>
            <button
                class="tab"
                classList={{
                    "tab-active": props.currentScreen === "create",
                    "tab-disabled": props.locked,
                }}
                onClick={changeScreen("create")}
            >
                Create
            </button>
        </div>
    );
}
