import { makeImmutable } from "immuts";
import { IItem } from "../model/interfaces";
import { IAction } from "../actions/actions";

const initialState = makeImmutable({
    items: [] as IItem[]
});

export default <T>(state: typeof initialState, action: IAction<T>) => {
    return state.__set(x => x.items, items => items.concat([]));
};