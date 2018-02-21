import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
initializeIcons(/* optional base url */);

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.render(
  <App />,
  rootElement
);

// tslint:disable-next-line:no-any
declare var module: any;
// tslint:disable-next-line:no-any
declare var require: any;

// Support HMR
if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.render(
      <NextApp />,
      rootElement
    );
  });
}

// registerServiceWorker();
