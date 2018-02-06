export interface IItem {
    id: number;

    values: { [key: string]: boolean | number | string | Date };
}

export interface IEntry {
    id: string;
}

export interface IPartition {
    readonly count: number;

    getLegendPartitions(): string[];

    placeItem(item: IItem): number | null;
}

export interface IBoard {
    readonly horizontalPartitions: IPartition[];
    readonly verticalPartitions: IPartition[];

    readonly items: IItem[];

    addHorizontalPartition(partition: IPartition): void;
    addVerticalPartition(partition: IPartition): void;
}

export class ItemValuePartition<T extends boolean | number | string | Date> implements IPartition {
    constructor(private fieldName: string, private itemValues: T[]) { }

    getLegendPartitions(): string[] {
        return this.itemValues.map(i => i.toString());
    }

    get count(): number {
        return this.itemValues.length;
    }

    placeItem(item: IItem): number | null {
        const value = item.values[this.fieldName];
        if (!value) {
            // Cannot place in this partition
            return null;
        }

        for (let i = 0; i < this.itemValues.length; ++i) {
            const itemValue = this.itemValues[i];
            if (itemValue === value) {
                return i;
            }
        }

        return null;
    }
}

export class Board implements IBoard {
    readonly horizontalPartitions: IPartition[] = [];
    readonly verticalPartitions: IPartition[] = [];

    items: IItem[] = [];

    addHorizontalPartition(partition: IPartition): void {
        this.horizontalPartitions.push(partition);
    }

    addVerticalPartition(partition: IPartition): void {
        this.verticalPartitions.push(partition);
    }
}