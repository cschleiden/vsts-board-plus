import * as React from "react";
import "./App.css";
import { BoardView } from "./components/board";
import { Board, ItemValuePartition } from "./model/interfaces";
import { HubComponent } from "./components/hub";

const b = new Board();
b.addHorizontalPartition(new ItemValuePartition<string>("State", ["Active", "Resolved"]));
b.addHorizontalPartition(new ItemValuePartition<string>("IsBlocked", ["Not Blocked", "Blocked"]));
// b.addHorizontalPartition(new ItemValuePartition<string>(["A", "B"]));

b.addVerticalPartition(new ItemValuePartition<string>("Parent", ["Feature 1", "Epic 2"]));
// b.addVerticalPartition(new ItemValuePartition<string>(["John", "Jane"]));

b.items = [
  {
    id: 1,
    values: {
      "State": "Active",
      "IsBlocked": "Blocked",
      "Parent": "Feature 1"
    }
  },
  {
    id: 10,
    values: {
      "State": "Active",
      "IsBlocked": "Blocked",
      "Parent": "Feature 1"
    }
  },
  {
    id: 2,
    values: {
      "State": "Resolved",
      "IsBlocked": "Blocked",
      "Parent": "Feature 1"
    }
  },
  {
    id: 3,
    values: {
      "State": "Active",
      "IsBlocked": "Not Blocked",
      "Parent": "Epic 2"
    }
  }
];

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <HubComponent>
          <BoardView board={b} />
        </HubComponent>
      </div>
    );
  }
}

export default App;
