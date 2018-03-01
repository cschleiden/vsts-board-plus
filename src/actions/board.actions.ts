import { makeAction } from "./actions";
import { IBoardConfiguration, IItem, IPartition, IDropLocation, IFieldValueMap } from "../model/interfaces";

export const init = makeAction<{
    config: IBoardConfiguration;

    items: IItem[];

    verticalPartitions: IPartition[][];

    horizontalPartitions: IPartition[][];
}>("board-init");

export const refresh = makeAction<IBoardConfiguration>("board-refresh");

export const updateItems = makeAction<IItem[]>("board-items");

export const updateItem = makeAction<{ id: number; fieldChanges: IFieldValueMap; index?: number; }>("board-update-item");

export const drop = makeAction<{ id: number; location: IDropLocation }>("board-drop");