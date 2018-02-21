import { asyncActionCreator } from "./actions";
import * as Actions from "./configuration.actions";
import { IPartitionProviderTemplate } from "../model/interfaces";

export const addTemplate = (direction: "horizontal" | "vertical", template: IPartitionProviderTemplate) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.addTemplate({
        direction,
        template
    }));
});

export const removeTemplate = (direction: "horizontal" | "vertical", template: IPartitionProviderTemplate) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.removeTemplate({
        direction,
        template
    }));
});

export const updateName = (name: string) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.setName(name));
});

export const updateQuery = (queryId: string) => asyncActionCreator(async (dispatch) => {
    return dispatch(Actions.setQuery(queryId));
});