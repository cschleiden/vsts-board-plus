import * as React from "react";
import { connect } from "react-redux";
import { IState } from "../reducers";
import { IItem, IItemPlacement, IDropLocation, IPartition } from "../model/interfaces";
import { BoardView } from "./boardView";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { dropCard, initBoard } from "../actions/board.actionsCreator";

interface IBoardPivotProps {
    items: IItem[];

    horizontalPartitions: IPartition[][];
    verticalPartitions: IPartition[][];

    cells: IItemPlacement;

    init(): void;
    onDrop(id: number, drop: IDropLocation): void;
}

class BoardPivot extends React.PureComponent<IBoardPivotProps> {
    componentWillMount() {
        const { init } = this.props;
        init();
    }

    render() {
        const { horizontalPartitions, verticalPartitions, cells } = this.props;

        return (
            <div>
                <BoardView
                    horizontalPartitions={horizontalPartitions}
                    verticalPartitions={verticalPartitions}
                    cells={cells}
                    onCardMove={this.onCardMove}
                />
            </div>
        );
    }

    @autobind
    private onCardMove(id: number, drop: IDropLocation) {
        const { onDrop } = this.props;

        onDrop(id, drop);
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
            init: () => { dispatch(initBoard("test-id")); },
            onDrop: (id: number, drop: IDropLocation) => { dispatch(dropCard(id, drop)); }
        };
    }
)(BoardPivot);