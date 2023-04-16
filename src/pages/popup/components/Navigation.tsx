import { Setter } from "solid-js";
import { Screens } from "../Popup";

type NavigationProps = {
    currentScreen: Screens;
    changeScreen: Setter<Screens>;
};

export default function Navigation(props: NavigationProps) {
    return (
        <div class="tabs tabs-boxed">
            <button
                class="tab"
                classList={{ "tab-active": props.currentScreen === "join" }}
                onClick={() => props.changeScreen("join")}
            >
                Join
            </button>
            <button
                class="tab"
                classList={{ "tab-active": props.currentScreen === "create" }}
                onClick={() => props.changeScreen("create")}
            >
                Create
            </button>
        </div>
    );
}
