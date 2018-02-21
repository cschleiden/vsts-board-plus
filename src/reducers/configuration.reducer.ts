import { makeImmutable } from "immuts";
import { reducerMap } from "./reducers";
import * as Actions from "../actions/configuration.actions";
import { IPartitionProviderTemplate } from "../model/interfaces";

const initialState = makeImmutable({
    name: "",
    queryId: "",
    horizontalPartitions: [] as IPartitionProviderTemplate[],
    verticalPartitions: [] as IPartitionProviderTemplate[]
});

export type IConfigurationState = typeof initialState;

function addTemplate(state: IConfigurationState, payload: typeof Actions.addTemplate.payload): IConfigurationState {
    const { direction, template } = payload;

    if (direction === "horizontal") {
        return state.__set(x => x.horizontalPartitions, partitions => partitions.concat(template));
    } else {
        return state.__set(x => x.verticalPartitions, partitions => partitions.concat(template));
    }
}

function removeTemplate(state: IConfigurationState, payload: typeof Actions.addTemplate.payload): IConfigurationState {
    const { direction, template } = payload;

    if (direction === "horizontal") {
        return state.__set(x => x.horizontalPartitions, partitions => partitions.filter(p => p !== template));
    } else {
        return state.__set(x => x.verticalPartitions, partitions => partitions.filter(p => p !== template));
    }
}

function setName(state: IConfigurationState, name: typeof Actions.setName.payload): IConfigurationState {
    return state.__set(x => x.name, name);
}

function setQuery(state: IConfigurationState, queryId: typeof Actions.setQuery.payload): IConfigurationState {
    return state.__set(x => x.queryId, queryId);
}

export default reducerMap(
    initialState,
    [
        [Actions.addTemplate, addTemplate],
        [Actions.removeTemplate, removeTemplate],
        [Actions.setName, setName],
        [Actions.setQuery, setQuery]
    ]
);