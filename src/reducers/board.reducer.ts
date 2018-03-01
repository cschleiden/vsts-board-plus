import { makeImmutable } from "immuts";
import { IItem, IBoardConfiguration, IPartition, IItemPlacement } from "../model/interfaces";
import { reducerMap } from "./reducers";
import { placeItems, placeItem } from "../model/board";
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

function refresh(state: IBoardState, config: typeof Actions.refresh.payload): IBoardState {
    return state
        .__set(x => x.config, config);
}

function updateItems(state: IBoardState, items: typeof Actions.updateItems.payload): IBoardState {
    // TODO: Place all items
    // TODO: Replace partitions? 

    return state.__set(x => x.items, items);
}

function updateItem(state: IBoardState, payload: typeof Actions.updateItem.payload): IBoardState {
    // TODO: Replace partitions?

    const { id, fieldChanges, index } = payload;
    const { items, horizontalPartitions, verticalPartitions } = state;

    const itemIndex = items.findIndex(i => i.id === id);
    const item = items[itemIndex];

    // Determine old position    
    const { x: oldX, y: oldY } = placeItem(horizontalPartitions, verticalPartitions, item);

    // Update item
    state = state.__set(x => x.items, oldItems => {
        const updatedItems = oldItems && oldItems.slice(0) || [];
        updatedItems[itemIndex] = {
            ...item,
            values: {
                ...item.values,
                ...fieldChanges
            }
        };
        return updatedItems;
    });

    // Remove from source
    state = state.__set(x => x.placedItems[oldX][oldY], items => {
        const idx = items.findIndex(i => i.id === id);
        const items2 = items.slice(0);
        items2.splice(idx, 1);
        return items2;
    });

    // Add to new cell
    const updatedItem = state.items[itemIndex];
    const { x, y } = placeItem(horizontalPartitions, verticalPartitions, updatedItem);
    if (x !== null && y !== null) {
        state = state.__set(d => d.placedItems[x][y], items => {
            const items2 = items && items.slice(0) || [];
            items2.splice(index, 0, item);
            return items2;
        });
    }

    return state;
}

export default reducerMap(
    initialState,
    [
        [Actions.init, init],
        [Actions.updateItem, updateItem],
        [Actions.updateItems, updateItems],
        [Actions.refresh, refresh]
    ]
);