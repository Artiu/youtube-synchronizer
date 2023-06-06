import { ClientType } from "@src/pages/background/types";
import { clientType, isLocked, setClientType } from "../store";

export default function Navigation() {
    const changeScreen = (name: ClientType) => () => {
        if (isLocked()) return;
        setClientType(name);
    };

    return (
        <div class="tabs tabs-boxed">
            <button
                class="tab w-1/2"
                classList={{
                    "tab-active": clientType() === "receiver",
                    "tab-disabled": isLocked(),
                }}
                onClick={changeScreen("receiver")}
            >
                Join
            </button>
            <button
                class="tab w-1/2"
                classList={{
                    "tab-active": clientType() === "sender",
                    "tab-disabled": isLocked(),
                }}
                onClick={changeScreen("sender")}
            >
                Create
            </button>
        </div>
    );
}
