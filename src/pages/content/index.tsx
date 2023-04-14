import { render } from "solid-js/web";
import App from "./components/Demo/app";
import "@src/styles/index.css"

const root = document.createElement("div");
root.id = "extension-root";
document.body.append(root);

render(App, root);
