import { autobind } from "office-ui-fabric-react/lib/Utilities";
import "./board.scss";
import * as React from "react";
import { IPartition, IDropLocation, IItemPlacement, IItem } from "../model/interfaces";
import { css } from "../utils/css";
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot, Draggable, DropResult } from "react-beautiful-dnd";
import { iteratePartitions } from "../model/board";
import { Card } from "./card";
import { Legend } from "./legend";

export interface IBoardProps {
    horizontalPartitions: IPartition[][];
    verticalPartitions: IPartition[][];

    items: { [id: number]: IItem };
    cells: IItemPlacement;

    onCardMove(id: number, drop: IDropLocation, index: number): void;
}

export class BoardView extends React.Component<IBoardProps> {
    private cellMap: { [id: string]: IDropLocation } = {};

    render() {
        const { verticalPartitions, horizontalPartitions } = this.props;

        const numLegendColumns = verticalPartitions.length;
        const numLegendRows = horizontalPartitions.length;

        const numContentColumns = horizontalPartitions.reduce((c, hP) => c * hP.length, 1);
        const numContentRows = verticalPartitions.reduce((c, vP) => c * vP.length, 1);

        return (
            // tslint:disable-next-line:no-empty
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div
                    className="board"
                    style={{
                        gridTemplateColumns: `repeat(${numLegendColumns}, minmax(24px, max-content)) repeat(${numContentColumns}, 1.5fr)`,
                        gridTemplateRows: `repeat(${numLegendRows}, minmax(24px, max-content)) repeat(${numContentRows}, minmax(100px, max-content))`
                    }}
                >
                    {
                        /* Legend for columns, rendered as rows */
                        this._renderPartitions(horizontalPartitions, "column", numLegendColumns, numContentColumns, false)
                    }

                    {
                        /* Legend for rows, rendered as columns */
                        this._renderPartitions(verticalPartitions, "row", numLegendRows, numContentRows, true)
                    }

                    {
                        this._renderItems(numContentColumns, numContentRows)
                    }
                </div>
            </DragDropContext>
        );
    }

    private _renderPartitions(
        partitions: IPartition[][],
        className: string,
        numLegend: number,
        numContent: number,
        transpose: boolean): JSX.Element[][] | null {
        return partitions.map((part, index) => {
            let result: JSX.Element[] = [];

            // Later rows need to generate their columns multiple times
            const numParentPartitions = partitions
                .slice(0, index)
                .reduce((c, parent) => c * parent.length, 1);

            const span = numContent / (part.length * numParentPartitions);

            // Draw current partitions once per parent column
            for (let i = 0; i < numParentPartitions; ++i) {
                // Draw all columns for current level
                result.push(
                    ...part.map((partition, partIdx) => {
                        const firstNum =
                            (1 + numLegend)
                            + (i * (part.length * span))
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
                                <Legend
                                    type={partition.legendType}
                                    label={partition.label}
                                    vertical={transpose}
                                    displayData={partition.displayData}
                                />
                            </div>
                        );
                    })
                );
            }

            return result;
        });
    }

    private _renderItems(numContentColumns: number, numContentRows: number): JSX.Element[] {
        const { verticalPartitions, horizontalPartitions, cells, items } = this.props;

        // Lay out cells
        const numLegendColumns = verticalPartitions.length;
        const numLegendRows = horizontalPartitions.length;

        let result: JSX.Element[] = [];

        this.cellMap = {};

        iteratePartitions(horizontalPartitions, (hP, x) => {
            iteratePartitions(verticalPartitions, (vP, y) => {
                const cellItems = cells[+x] && cells[+x][+y] || [];

                const id = `${x}-${y}`;
                this.cellMap[id] = {
                    partitions: hP.concat(vP)
                };

                result.push(
                    <Droppable droppableId={id} key={id}>
                        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                            <div
                                ref={provided.innerRef}
                                className={css(
                                    "cell",
                                    snapshot.isDraggingOver && "cell-drop"
                                )}
                                style={{
                                    gridColumn: 1 + numLegendColumns + (+x),
                                    gridRow: 1 + numLegendRows + (+y)
                                }}
                            >
                                {
                                    /* Render current items in cell */
                                    cellItems.map((id, index) => {
                                        const item = items[id];

                                        return (
                                            <Draggable
                                                draggableId={`${id}`}
                                                key={id}
                                                {...{ index }}
                                                isDragDisabled={item.inProgress}
                                            >
                                                {(dragProvided, dragSnapshot) => (
                                                    <div>
                                                        <Card
                                                            item={item}
                                                            draggable={dragProvided}
                                                        />
                                                        {dragProvided.placeholder}
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })
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

        if (result && result.destination && result.destination.droppableId) {
            const id = result.destination.droppableId;
            const cell = this.cellMap[id];

            if (onCardMove) {
                onCardMove(+result.draggableId, cell, result.destination.index);
            }
        }
    }
}
