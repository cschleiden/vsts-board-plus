import { makeAction } from "./actions";

export const toggleConfigurationPanel = makeAction<boolean>("nav-configure");

export const switchView = makeAction<string>("nav-switch-view");