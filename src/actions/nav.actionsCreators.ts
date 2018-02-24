import { asyncActionCreator } from "./actions";
import * as NavActions from "./nav.actions";
import * as ConfigurationActions from "./configuration.actions";

export const configureBoard = (boardId: string) => asyncActionCreator(async (dispatch, getState) => {
    const state = getState();
    const { board } = state;
    const { config } = board;

    dispatch(NavActions.toggleConfigurationPanel(true));
    return dispatch(ConfigurationActions.setConfig(config));
});

export const cancelBoardConfiguration = () => asyncActionCreator(async (dispatch) => {
    return dispatch(NavActions.toggleConfigurationPanel(false));
});