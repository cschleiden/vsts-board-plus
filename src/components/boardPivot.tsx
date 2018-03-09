import * as React from "react";
import { connect } from "react-redux";
import { IState } from "../reducers";
import { IItem, IItemPlacement, IDropLocation, IPartition } from "../model/interfaces";
import { BoardView } from "./boardView";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { dropCard, initBoard } from "../actions/board.actionsCreator";

interface IBoardPivotProps {
    horizontalPartitions: IPartition[][];
    verticalPartitions: IPartition[][];

    items: { [id: number]: IItem };
    cells: IItemPlacement;

    onDrop(id: number, drop: IDropLocation, index: number): void;
}

class BoardPivot extends React.PureComponent<IBoardPivotProps> {
    render() {
        const { horizontalPartitions, verticalPartitions, items, cells } = this.props;

        return (
            <div>
                <BoardView
                    horizontalPartitions={horizontalPartitions}
                    verticalPartitions={verticalPartitions}
                    items={items}
                    cells={cells}
                    onCardMove={this.onCardMove}
                />
            </div>
        );
    }

    @autobind
    private onCardMove(id: number, drop: IDropLocation, index: number) {
        const { onDrop } = this.props;

        onDrop(id, drop, index);
    }
}

export default connect(
    (state: IState) => {
        const { placedItems, items, horizontalPartitions, verticalPartitions } = state.board;

        return {
            items,
            horizontalPartitions,
            verticalPartitions,
            cells: placedItems
        };
    },
    (dispatch) => {
        return {
            onDrop: (id: number, drop: IDropLocation, index: number) => { dispatch(dropCard(id, drop, index)); }
        };
    }
)(BoardPivot);