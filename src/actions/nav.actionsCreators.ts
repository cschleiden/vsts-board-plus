import { asyncActionCreator } from "./actions";
import * as Actions from "./nav.actions";

export const configureBoard = (boardId: string) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.toggleConfigurationPanel(true));
});

export const cancelBoardConfiguration = (boardId: string) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.toggleConfigurationPanel(false));
});