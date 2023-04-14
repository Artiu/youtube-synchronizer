import { createSignal } from "solid-js";
import Navigation from "./components/Navigation";
import JoinScreen from "./screens/Join";
import { Dynamic } from "solid-js/web";
import CreateScreen from "./screens/Create";

export type Screens = keyof typeof screens;

const screens = {
  join: JoinScreen,
  create: CreateScreen,
}

const Popup = () => {
  const [screen, setScreen] = createSignal<Screens>("join");

  return (
    <div class="w-[400px]">
      <Navigation currentScreen={screen()} changeScreen={setScreen}/>
      <Dynamic component={screens[screen()]} />
    </div>
  );
};

export default Popup;
