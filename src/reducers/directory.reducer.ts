import { makeImmutable } from "immuts";
import { IBoardConfiguration } from "../model/interfaces";
import { reducerMap } from "./reducers";
import * as Actions from "./../actions/directory.actions";

const initialState = makeImmutable({
    boards: [] as IBoardConfiguration[]
});

export type IDirectoryState = typeof initialState;

function init(state: IDirectoryState, boards: typeof Actions.init.payload): IDirectoryState {
    return state.__set(x => x.boards, boards);
}

export default reducerMap(
    initialState,
    [
        [Actions.init, init]
    ]
);