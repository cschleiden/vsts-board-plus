export interface IFieldValueMap {
    [key: string]: boolean | number | string | Date;
}

export interface IItem {
    id: number;

    values: IFieldValueMap;
}

export interface IEntry {
    id: string;
}

export interface IPartition {
    label: string;

    // TODO
    value: string;

    fieldName: string;
}

export interface IItemPlacement {
    [x: number]: { [y: number]: IItem[] };
}

export interface IPartitionProvider {
    readonly type: string;

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]>;
}

export interface IPartitionProviderInputs {
    // tslint:disable-next-line:no-any
    [key: string]: any;
}

export interface IPartitionProviderConfiguration {
    type: string;

    displayName: string;

    fieldName: string;

    inputs?: IPartitionProviderInputs;

    // tslint:disable-next-line:no-any
    // data: any;
}

export interface IBoardConfiguration {
    id: string;
    name: string;

    horizontalPartitionProviders: IPartitionProviderConfiguration[];
    verticalPartitionProviders: IPartitionProviderConfiguration[];
}

// export interface IBoard {
//     readonly horizontalPartitionProviders: IPartitionProvider[];
//     readonly verticalPartitionProviders: IPartitionProvider[];

//     readonly items: IItem[];

//     addHorizontalPartition(partition: IPartitionProvider): void;
//     addVerticalPartition(partition: IPartitionProvider): void;
// }

// // TODO: Move
// export class ItemValuePartition<T extends boolean | number | string | Date> implements IPartitionProvider {
//     public readonly type = "static";

//     constructor(private fieldName: string, private itemValues: T[]) { }

//     getPartitions(): IPartition[] {
//         return this.itemValues.map(i => ({
//             label: i.toString(),
//             value: i.toString()
//         }));
//     }

//     get count(): number {
//         return this.itemValues.length;
//     }

//     placeItem(item: IItem): number | null {
//         const value = item.values[this.fieldName];
//         if (!value) {
//             // Cannot place in this partition
//             return null;
//         }

//         for (let i = 0; i < this.itemValues.length; ++i) {
//             const itemValue = this.itemValues[i];
//             if (itemValue === value) {
//                 return i;
//             }
//         }

//         return null;
//     }
// }

// export class Board implements IBoard {
//     readonly horizontalPartitionProviders: IPartitionProvider[] = [];
//     readonly verticalPartitionProviders: IPartitionProvider[] = [];

//     items: IItem[] = [];

//     addHorizontalPartition(partition: IPartitionProvider): void {
//         this.horizontalPartitionProviders.push(partition);
//     }

//     addVerticalPartition(partition: IPartitionProvider): void {
//         this.verticalPartitionProviders.push(partition);
//     }
// }

// TODO...
export interface IDropLocation {
    partitions: IPartition[];
}