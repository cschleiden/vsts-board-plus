export interface IItem {
    id: number;

    values: { [key: string]: boolean | number | string | Date };
}

export interface IEntry {
    id: string;
}

export interface IPartition {
    label: string;

    // TODO
    value: string;
}

export interface IPartitionProvider {
    readonly count: number;

    getPartitions(): IPartition[];

    placeItem(item: IItem): number | null;
}

export interface IBoard {
    readonly horizontalPartitionProviders: IPartitionProvider[];
    readonly verticalPartitionProviders: IPartitionProvider[];

    readonly items: IItem[];

    addHorizontalPartition(partition: IPartitionProvider): void;
    addVerticalPartition(partition: IPartitionProvider): void;
}

export class ItemValuePartition<T extends boolean | number | string | Date> implements IPartitionProvider {
    constructor(private fieldName: string, private itemValues: T[]) { }

    getPartitions(): IPartition[] {
        return this.itemValues.map(i => ({
            label: i.toString(),
            value: i.toString()
        }));
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
    readonly horizontalPartitionProviders: IPartitionProvider[] = [];
    readonly verticalPartitionProviders: IPartitionProvider[] = [];

    items: IItem[] = [];

    addHorizontalPartition(partition: IPartitionProvider): void {
        this.horizontalPartitionProviders.push(partition);
    }

    addVerticalPartition(partition: IPartitionProvider): void {
        this.verticalPartitionProviders.push(partition);
    }
}