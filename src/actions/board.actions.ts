import { makeAction } from "./actions";
import { IBoardConfiguration, IItem, IPartition, IDropLocation, IFieldValueMap } from "../model/interfaces";

export const init = makeAction<{
    config: IBoardConfiguration;

    items: { [id: number]: IItem };

    verticalPartitions: IPartition[][];

    horizontalPartitions: IPartition[][];
}>("board-init");

export const refresh = makeAction<IBoardConfiguration>("board-refresh");

export const updateItems = makeAction<IItem[]>("board-items");

export const updateItem = makeAction<{
    id: number;
    fieldChanges: IFieldValueMap;
    index?: number;
    inProgress: boolean;
}>("board-update-item");


export const updateItemStatus = makeAction<{ id: number; inProgress: boolean; message?: string; }>("board-update-item-status");

export const drop = makeAction<{ id: number; location: IDropLocation }>("board-drop");