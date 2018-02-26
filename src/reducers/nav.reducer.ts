import { makeImmutable } from "immuts";
import { reducerMap } from "./reducers";
import * as Actions from "./../actions/nav.actions";
import * as BoardActions from "./../actions/board.actions";

const initialState = makeImmutable({
    view: "" as string,

    boardId: null as string,

    configurationOpen: false
});

export type INavState = typeof initialState;

function switchView(state: INavState, view: typeof Actions.switchView.payload): INavState {
    return state.__set(x => x.view, view);
}

function openBoard(state: INavState, view: typeof BoardActions.init.payload): INavState {
    return state.__set(x => x.view, "board");
}

function toggleConfigurationPanel(state: INavState, payload: typeof Actions.toggleConfigurationPanel.payload): INavState {
    return state.__set(x => x.configurationOpen, payload);
}

export default reducerMap(
    initialState,
    [
        [Actions.toggleConfigurationPanel, toggleConfigurationPanel],
        [Actions.switchView, switchView],
        [BoardActions.init, openBoard]
    ]
);