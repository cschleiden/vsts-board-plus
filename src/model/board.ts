import { IPartition, IItem, IItemPlacement, IItemPlacementLocation } from "./interfaces";

export function iteratePartitions(partitions: IPartition[][], callback: (partitions: IPartition[], index: number) => void) {
    const numIterations = partitions
        .reduce((c, partitionProvider) => c * partitionProvider.length, 1);

    const indexes: number[] = new Array<number>(partitions.length).fill(0);

    for (let iteration = 0; iteration < numIterations; ++iteration) {
        callback(
            indexes.map((index, idx) => partitions[idx][index]),
            iteration
        );

        for (let j = indexes.length - 1; j >= 0; --j) {
            ++indexes[j];
            if (indexes[j] >= partitions[j].length) {
                indexes[j] = 0;
            } else {
                break;
            }
        }
    }
}

export function placeItemInPartitions(partitions: IPartition[], item: IItem): number {
    for (let i = 0; i < partitions.length; ++i) {
        const partition = partitions[i];

        if (partition.value === item.values[partition.fieldName]) {
            return i;
        }
    }

    return null;
}

export function placeItems(
    horizontalPartitions: IPartition[][],
    verticalPartitions: IPartition[][],
    items: IItem[]): IItemPlacement {
    const cells: IItemPlacement = {};

    for (const item of items) {
        const { x, y } = placeItem(horizontalPartitions, verticalPartitions, item);

        if (x === null || y === null) {
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

    return cells;
}

export function placeItem(
    horizontalPartitions: IPartition[][],
    verticalPartitions: IPartition[][],
    item: IItem): IItemPlacementLocation {
    let x: number | null = null;
    let y: number | null = null;

    for (let i = 0; i < horizontalPartitions.length; ++i) {
        const p = placeItemInPartitions(horizontalPartitions[i], item);
        if (p !== null) {
            if (x === null) {
                x = p;
            } else {
                x *= horizontalPartitions[i].length;
                x += p;
            }
        }
    }

    if (x !== null) {
        for (let i = 0; i < verticalPartitions.length; ++i) {
            const p = placeItemInPartitions(verticalPartitions[i], item);
            if (p !== null) {
                if (y === null) {
                    y = p;
                } else {
                    y *= verticalPartitions[i].length;
                    y += p;
                }
            }
        }
    }

    return {
        x,
        y
    };
}