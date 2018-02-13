import { makeImmutable } from "immuts";
import { IItem } from "../model/interfaces";
import { IAction } from "../actions/actions";

const initialState = makeImmutable({
    items: [
        {
            id: 1,
            values: {
                "State": "Active",
                "IsBlocked": "Blocked",
                "Parent": "Feature 1"
            }
        },
        {
            id: 10,
            values: {
                "State": "Active",
                "IsBlocked": "Blocked",
                "Parent": "Feature 1"
            }
        },
        {
            id: 11,
            values: {
                "State": "Active",
                "IsBlocked": "Blocked",
                "Parent": "Feature 1"
            }
        },
        {
            id: 2,
            values: {
                "State": "Resolved",
                "IsBlocked": "Blocked",
                "Parent": "Feature 1"
            }
        },
        {
            id: 3,
            values: {
                "State": "Active",
                "IsBlocked": "Not Blocked",
                "Parent": "Epic 2"
            }
        }
    ] as IItem[]
});

export type IBoardState = typeof initialState;

export default <T>(state: IBoardState = initialState, action: IAction<T>) => {
    return state.__set(x => x.items, items => items.concat([]));
};