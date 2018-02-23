import { asyncActionCreator } from "./actions";
import * as Actions from "./configuration.actions";
import { PartitionProviderType } from "../model/interfaces";

export const addTemplate = (direction: "horizontal" | "vertical", type: PartitionProviderType) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.addPartition({
        direction,
        type
    }));
});

export const removeTemplate = (direction: "horizontal" | "vertical", index: number) => asyncActionCreator(async (dispatch) => {
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