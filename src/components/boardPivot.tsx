import * as React from "react";
import { connect } from "react-redux";
import { IState } from "../reducers";
import { IItem, Board, ItemValuePartition } from "../model/interfaces";
import { BoardView } from "./board";
import { autobind } from "office-ui-fabric-react/lib/Utilities";

interface IBoardPivotProps {
    items: IItem[];
}

class BoardPivot extends React.Component<IBoardPivotProps> {
    render() {
        const board = new Board();

        board.addHorizontalPartition(new ItemValuePartition<string>("State", ["Active", "Resolved"]));
        board.addHorizontalPartition(new ItemValuePartition<string>("IsBlocked", ["Not Blocked", "Blocked"]));
        // b.addHorizontalPartition(new ItemValuePartition<string>(["A", "B"]));

        board.addVerticalPartition(new ItemValuePartition<string>("Parent", ["Feature 1", "Epic 2"]));
        board.addVerticalPartition(new ItemValuePartition<string>("Assigned To", ["John", "Jane"]));

        board.items = this.props.items;

        return (
            <div>
                <BoardView
                    board={board}
                    onCardMove={this.onCardMove}
                />
            </div>
        );
    }

    @autobind
    private onCardMove() {
        // 
    }
}

export default connect(((state: IState) => {
    return {
        items: state.board.items
    };
}))(BoardPivot);