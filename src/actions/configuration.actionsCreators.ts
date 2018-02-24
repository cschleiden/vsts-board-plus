import { asyncActionCreator } from "./actions";
import * as Actions from "./configuration.actions";
import * as NavActions from "./nav.actions";
import { PartitionProviderType, Direction, IPartitionProviderInputs } from "../model/interfaces";
import { BoardService } from "../model/boardService";
import { initBoard } from "./board.actionsCreator";

export const addTemplate = (direction: Direction, type: PartitionProviderType) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.addPartition({
        direction,
        type
    }));
});

export const removeTemplate = (direction: Direction, index: number) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.removePartition({
        direction,
        index
    }));
});

export const updateName = (name: string) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.setName(name));
});

export const updateQuery = (queryId: string) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.setQuery(queryId));
});

export const updateInputs = (
    direction: Direction,
    index: number,
    inputs: IPartitionProviderInputs) => asyncActionCreator(async (dispatch) => {
        return dispatch(Actions.updateInputs({
            direction, index, inputs
        }));
    });

export const saveConfig = () => asyncActionCreator(async (dispatch, getState) => {
    const state = getState();
    const { configuration } = state;

    const boardService = new BoardService();
    return boardService.saveBoardConfiguration(configuration)
        .then(() => dispatch(initBoard(configuration.id)))
        .then(() => dispatch(NavActions.toggleConfigurationPanel(false)));
});