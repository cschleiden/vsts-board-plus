import "./App.css";
import * as React from "react";
import { HubComponent } from "./components/hub";
import { Provider } from "react-redux";
import BoardPivot from "./components/boardPivot";
import store from "./store";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <HubComponent>
            <BoardPivot />
          </HubComponent>
        </div>
      </Provider>
    );
  }
}

export default App;
