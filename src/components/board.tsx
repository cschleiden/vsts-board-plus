import "./board.css";
import * as React from "react";
import { IBoard, IPartition, IItem } from "../model/interfaces";
import { css } from "../utils/css";
// import { css } from "../utils/css";

export interface IBoardProps {
    board: IBoard;
}

export class BoardView extends React.Component<IBoardProps> {
    render() {
        const { board } = this.props;

        const numLegendColumns = board.verticalPartitions.length;
        const numLegendRows = board.horizontalPartitions.length;

        const numContentColumns = board.horizontalPartitions.reduce((c, hP) => c * hP.count, 1);
        const numContentRows = board.verticalPartitions.reduce((c, vP) => c * vP.count, 1);

        return (
            <div
                className="board"
                style={{
                    gridTemplateColumns: `repeat(${numLegendColumns}, auto) repeat(${numContentColumns}, 1fr)`,
                    gridTemplateRows: `repeat(${numLegendRows}, auto) repeat(${numContentRows}, 1fr)`
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
                    this._renderItems()
                }
            </div>
        );
    }

    private _renderPartitions(partitions: IPartition[], className: string, numLegend: number, numContent: number, transpose: boolean): JSX.Element[][] | null {
        return partitions.map((part, index) => {
            let result: JSX.Element[] = [];

            // Later rows need to generate their columns multiple times
            const numParentColumns = partitions
                .slice(0, index)
                .reduce((c, parent) => c * parent.count, 1);

            const span = numContent / (part.count * numParentColumns);

            // Draw current columns once per parent column
            for (let i = 0; i < numParentColumns; ++i) {
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
                                {label}
                            </div>
                        );
                    })
                );
            }

            return result;
        });
    }

    private _renderItems(): JSX.Element[] {
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
        for (const x of Object.keys(cells)) {
            for (const y of Object.keys(cells[x])) {
                const cell = cells[+x][+y];

                result.push(
                    <div
                        className="cell"
                        style={{
                            gridColumn: 1 + numLegendColumns + (+x),
                            gridRow: 1 + numLegendRows + (+y)
                        }}
                    >
                        {cell.map(item => (
                            <div className="item" key={item.id}>
                                {item.id}
                                {/*JSON.stringify(item.values)*/}
                            </div>
                        ))}
                    </div>
                );
            }
        }

        return result;
    }
}