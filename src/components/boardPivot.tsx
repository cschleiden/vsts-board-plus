import * as React from "react";
import { connect } from "react-redux";
import { IState } from "../reducers";
import { IItem, Board, ItemValuePartition } from "../model/interfaces";
import { BoardView, IPartitionDrop } from "./board";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { boardDrop } from "../actions/board.actions";

interface IBoardPivotProps {
    items: IItem[];

    onDrop(id: number, drop: IPartitionDrop): void;
}

class BoardPivot extends React.Component<IBoardPivotProps> {
    render() {
        const board = new Board();

        board.addHorizontalPartition(new ItemValuePartition<string>("State", ["Active", "Resolved"]));
        board.addHorizontalPartition(new ItemValuePartition<string>("IsBlocked", ["Not Blocked", "Blocked"]));
        board.addHorizontalPartition(new ItemValuePartition<string>("Dummy", ["A", "B"]));

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
    private onCardMove(id: number, drop: IPartitionDrop) {
        const { onDrop } = this.props;

        onDrop(id, drop);
    }
}

export default connect(
    (state: IState) => {
        return {
            items: state.board.items
        };
    },
    (dispatch) => {
        return {
            onDrop: (id: number, drop: IPartitionDrop) => { dispatch(boardDrop(id, drop)); }
        };
    }
)(BoardPivot);