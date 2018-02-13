import "./board.css";
import * as React from "react";
import { IBoard, IPartition, IItem } from "../model/interfaces";
import { css } from "../utils/css";
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot, Draggable, DropResult } from "react-beautiful-dnd";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
// import { css } from "../utils/css";

export interface IBoardProps {
    board: IBoard;

    onCardMove(id: number, ): void;
}

export class BoardView extends React.Component<IBoardProps> {
    render() {
        const { board } = this.props;

        const numLegendColumns = board.verticalPartitions.length;
        const numLegendRows = board.horizontalPartitions.length;

        const numContentColumns = board.horizontalPartitions.reduce((c, hP) => c * hP.count, 1);
        const numContentRows = board.verticalPartitions.reduce((c, vP) => c * vP.count, 1);

        return (
            // tslint:disable-next-line:no-empty
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div
                    className="board"
                    style={{
                        gridTemplateColumns: `repeat(${numLegendColumns}, 24px) repeat(${numContentColumns}, minmax(210px, auto))`,
                        gridTemplateRows: `repeat(${numLegendRows}, 24px) repeat(${numContentRows}, minmax(100px, auto))`
                    }}
                >
                    {
                        /* Legend for columns, rendered as rows */
                        this._renderPartitions(board.horizontalPartitions, "column", numLegendColumns, numContentColumns, false)
                    }

                    {
                        /* Legend for rows, rendered as columns */
                        this._renderPartitions(board.verticalPartitions, "row", numLegendRows, numContentRows, true)
                    }

                    {
                        this._renderItems(numContentColumns, numContentRows)
                    }
                </div>
            </DragDropContext>
        );
    }

    private _renderPartitions(partitions: IPartition[], className: string, numLegend: number, numContent: number, transpose: boolean): JSX.Element[][] | null {
        return partitions.map((part, index) => {
            let result: JSX.Element[] = [];

            // Later rows need to generate their columns multiple times
            const numParentPartitions = partitions
                .slice(0, index)
                .reduce((c, parent) => c * parent.count, 1);

            const span = numContent / (part.count * numParentPartitions);

            // Draw current partitions once per parent column
            for (let i = 0; i < numParentPartitions; ++i) {
                // Draw all columns for current level
                result.push(
                    ...part.getLegendPartitions().map((label, partIdx) => {
                        const firstNum =
                            (1 + numLegend)
                            + (i * (part.count * span))
                            + (partIdx * span);

                        const first = `${firstNum} / ${firstNum + span}`;
                        const second = index + 1;

                        return (
                            <div
                                key={`${firstNum}-${index}`}
                                className={css(className, "header")}
                                style={{
                                    gridColumn: transpose ? second : first,
                                    gridRow: transpose ? first : second
                                }}
                            >
                                <div className="text">
                                    {label}
                                </div>
                            </div>
                        );
                    })
                );
            }

            return result;
        });
    }

    private _renderItems(numContentColumns: number, numContentRows: number): JSX.Element[] {
        const { board } = this.props;
        const { items, verticalPartitions, horizontalPartitions } = board;

        const cells: { [x: number]: { [y: number]: IItem[] } } = {};

        for (const item of items) {
            // Determine horizontal placement
            let x: number | null = null;

            for (let i = 0; i < horizontalPartitions.length; ++i) {
                const p = horizontalPartitions[i].placeItem(item);
                if (p !== null) {
                    if (x === null) {
                        x = p;
                    } else {
                        x *= horizontalPartitions[i].count;
                        x += p;
                    }
                }
            }

            if (x === null) {
                // Not on this board
                continue;
            }

            // Determine vertical placement
            let y: number | null = null;

            for (let i = 0; i < verticalPartitions.length; ++i) {
                const p = verticalPartitions[i].placeItem(item);
                if (p !== null) {
                    if (y === null) {
                        y = p;
                    } else {
                        y *= verticalPartitions[i].count;
                        y += p;
                    }
                }
            }

            if (y === null) {
                // Not on this board
                continue;
            }

            // Place
            if (!cells[x]) {
                cells[x] = {};
            }

            if (cells[x][y]) {
                cells[x][y].push(item);
            } else {
                cells[x][y] = [item];
            }
        }

        // Lay out cells

        const numLegendColumns = verticalPartitions.length;
        const numLegendRows = horizontalPartitions.length;

        let result: JSX.Element[] = [];
        // for (const x of Object.keys(cells)) {
        for (let x = 0; x < numContentColumns; ++x) {
            // for (const y of Object.keys(cells[x])) {
            for (let y = 0; y < numContentRows; ++y) {
                const cellItems = cells[+x] && cells[+x][+y] || [];

                result.push(
                    <Droppable droppableId={`cell-${+x}-${+y}`}>
                        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                            <div
                                ref={provided.innerRef}
                                className="cell"
                                style={{
                                    gridColumn: 1 + numLegendColumns + (+x),
                                    gridRow: 1 + numLegendRows + (+y)
                                }}
                            >
                                {
                                    cellItems.map(item => (
                                        <Draggable
                                            draggableId={`card-${item.id}`}
                                            key={item.id}
                                        >
                                            {(dragProvided, dragSnapshot) => (
                                                <div>
                                                    <div
                                                        className="item"
                                                        ref={dragProvided.innerRef}
                                                        style={dragProvided.draggableStyle}
                                                        // tslint:disable-next-line:no-any
                                                        {...(dragProvided as any).draggableProps}
                                                        {...dragProvided.dragHandleProps}
                                                    >
                                                        {item.id}
                                                    </div>
                                                    {dragProvided.placeholder}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                }

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                );
            }
        }

        return result;
    }

    @autobind
    private onDragEnd(result: DropResult) {
        const { onCardMove } = this.props;

        if (onCardMove) {
            onCardMove(+result.draggableId /* , result.destination.droppableId */);
        }
    }
}