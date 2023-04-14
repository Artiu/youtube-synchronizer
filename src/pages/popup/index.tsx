import { render } from "solid-js/web";
import Popup from "./Popup";
import "@src/styles/index.css"

const appContainer = document.querySelector("#app-container");
if (!appContainer) {
  throw new Error("Can not find AppContainer");
}

render(Popup, appContainer);
