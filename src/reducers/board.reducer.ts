import { makeImmutable } from "immuts";
import { IItem, IBoardConfiguration, IPartition, IItemPlacement } from "../model/interfaces";
import { reducerMap } from "./reducers";
import { placeItems } from "../model/board";
import * as Actions from "./../actions/board.actions";

const initialState = makeImmutable({
    config: null as IBoardConfiguration,

    items: [] as IItem[],

    horizontalPartitions: [] as IPartition[][],
    verticalPartitions: [] as IPartition[][],

    placedItems: {} as IItemPlacement
});

export type IBoardState = typeof initialState;

function init(state: IBoardState, payload: typeof Actions.init.payload): IBoardState {
    const { items, config, horizontalPartitions, verticalPartitions } = payload;

    return state.__set({
        config,
        items,
        horizontalPartitions,
        verticalPartitions,
        placedItems: placeItems(horizontalPartitions, verticalPartitions, items)
    });
}

function updateItems(state: IBoardState, items: typeof Actions.updateItems.payload): IBoardState {
    // TODO: Place all items
    // TODO: Replace partitions? 

    return state.__set(x => x.items, items);
}

function updateItem(state: IBoardState, payload: typeof Actions.updateItem.payload): IBoardState {
    // TODO: Replace partitions?

    const { id, fieldChanges } = payload;
    const { items, horizontalPartitions, verticalPartitions } = state;

    const idx = items.findIndex(i => i.id === id);
    const item = items[idx];

    const updatedItems = items.slice(0);
    updatedItems[idx] = {
        ...item,
        values: {
            ...item.values,
            ...fieldChanges
        }
    };

    // Update the changed item, then re-place all items
    return state
        .__set(x => x.items, updatedItems)
        .__set(x => x.placedItems, placeItems(horizontalPartitions, verticalPartitions, updatedItems));
}

export default reducerMap(
    initialState,
    [
        [Actions.init, init],
        [Actions.updateItem, updateItem],
        [Actions.updateItems, updateItems]
    ]
);