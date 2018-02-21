import { makeImmutable } from "immuts";
import { reducerMap } from "./reducers";
import * as Actions from "./../actions/nav.actions";

const initialState = makeImmutable({
    boardId: null as string,
    configurationOpen: false
});

export type INavState = typeof initialState;

function toggleConfigurationPanel(state: INavState, payload: typeof Actions.toggleConfigurationPanel.payload): INavState {
    return state.__set(x => x.configurationOpen, payload);
}

export default reducerMap(
    initialState,
    [
        [Actions.toggleConfigurationPanel, toggleConfigurationPanel]
    ]
);