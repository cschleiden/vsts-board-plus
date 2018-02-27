import "./App.scss";
import * as React from "react";
import Main from "./views/main";
import { Provider } from "react-redux";
import store from "./store";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Main />
        </div>
      </Provider>
    );
  }
}