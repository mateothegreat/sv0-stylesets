import { mount } from "svelte";

// import "./app.css";
import "@sv0/components/theme";

import App from "./app.svelte";

const app = mount(App, {
  target: document.getElementById("app")!
});

export default app;
