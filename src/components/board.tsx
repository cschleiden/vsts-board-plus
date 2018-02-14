import { autobind } from "office-ui-fabric-react/lib/Utilities";
import "./board.css";
import * as React from "react";
import { IBoard, IPartitionProvider, IItem, IPartition } from "../model/interfaces";
import { css } from "../utils/css";
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot, Draggable, DropResult } from "react-beautiful-dnd";

export interface IPartitionDrop {
    partitions: IPartition[];
}

export interface IBoardProps {
    board: IBoard;

    onCardMove(id: number, drop: IPartitionDrop): void;
}

export class BoardView extends React.Component<IBoardProps> {
    private cellMap: { [id: string]: IPartitionDrop } = {};

    render() {
        const { board } = this.props;

        const numLegendColumns = board.verticalPartitionProviders.length;
        const numLegendRows = board.horizontalPartitionProviders.length;

        const numContentColumns = board.horizontalPartitionProviders.reduce((c, hP) => c * hP.count, 1);
        const numContentRows = board.verticalPartitionProviders.reduce((c, vP) => c * vP.count, 1);

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
                        this._renderPartitions(board.horizontalPartitionProviders, "column", numLegendColumns, numContentColumns, false)
                    }

                    {
                        /* Legend for rows, rendered as columns */
                        this._renderPartitions(board.verticalPartitionProviders, "row", numLegendRows, numContentRows, true)
                    }

                    {
                        this._renderItems(numContentColumns, numContentRows)
                    }
                </div>
            </DragDropContext>
        );
    }

    private _iteratePartitions(partitionProviders: IPartitionProvider[], callback: (partitions: IPartition[], index: number) => void) {
        const numIterations = partitionProviders
            .reduce((c, partitionProvider) => c * partitionProvider.count, 1);

        const indexes: number[] = new Array<number>(partitionProviders.length).fill(0);

        for (let i = 0; i < numIterations; ++i) {
            callback(
                indexes.map((index, idx) => partitionProviders[idx].getPartitions()[index]),
                i
            );

            for (let j = indexes.length - 1; j >= 0; --j) {
                ++indexes[j];
                if (indexes[j] >= partitionProviders[j].count) {
                    indexes[j] = 0;
                } else {
                    break;
                }
            }
        }
    }

    private _renderPartitions(
        partitions: IPartitionProvider[],
        className: string,
        numLegend: number,
        numContent: number,
        transpose: boolean): JSX.Element[][] | null {
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
                    ...part.getPartitions().map((partition, partIdx) => {
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
                                    {partition.label}
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
        const { items, verticalPartitionProviders, horizontalPartitionProviders } = board;

        const cells: { [x: number]: { [y: number]: IItem[] } } = {};

        for (const item of items) {
            // Determine horizontal placement
            let x: number | null = null;

            for (let i = 0; i < horizontalPartitionProviders.length; ++i) {
                const p = horizontalPartitionProviders[i].placeItem(item);
                if (p !== null) {
                    if (x === null) {
                        x = p;
                    } else {
                        x *= horizontalPartitionProviders[i].count;
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

            for (let i = 0; i < verticalPartitionProviders.length; ++i) {
                const p = verticalPartitionProviders[i].placeItem(item);
                if (p !== null) {
                    if (y === null) {
                        y = p;
                    } else {
                        y *= verticalPartitionProviders[i].count;
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

        const numLegendColumns = verticalPartitionProviders.length;
        const numLegendRows = horizontalPartitionProviders.length;

        let result: JSX.Element[] = [];

        this._iteratePartitions(board.horizontalPartitionProviders, (horizontalPartitions, x) => {
            this._iteratePartitions(board.verticalPartitionProviders, (verticalPartitions, y) => {
                const cellItems = cells[+x] && cells[+x][+y] || [];

                const id = `${x}-${y}`;
                this.cellMap[id] = {
                    partitions: horizontalPartitions.concat(verticalPartitions)
                };

                result.push(
                    <Droppable droppableId={id} key={id}>
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
                                            draggableId={`${item.id}`}
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
            });
        });

        return result;
    }

    @autobind
    private onDragEnd(result: DropResult) {
        const { onCardMove } = this.props;

        const id = result.destination.droppableId;
        const cell = this.cellMap[id];

        if (onCardMove) {
            onCardMove(+result.draggableId, cell);
        }
    }
}
