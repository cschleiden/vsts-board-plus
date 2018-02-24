import { makeImmutable } from "immuts";
import { reducerMap } from "./reducers";
import * as Actions from "../actions/configuration.actions";
import { IPartitionProviderConfiguration, IBoardConfiguration } from "../model/interfaces";

const initialState = makeImmutable({
} as IBoardConfiguration);

export type IConfigurationState = typeof initialState;

function setConfig(state: IConfigurationState, config: typeof Actions.setConfig.payload): IConfigurationState {
    return state.__set(config);
}

function addTemplate(state: IConfigurationState, payload: typeof Actions.addPartition.payload): IConfigurationState {
    const { direction, type } = payload;

    const newPartition: IPartitionProviderConfiguration = {
        type
    };

    if (direction === "horizontal") {
        return state.__set(x => x.horizontalPartitionProviders, partitions => partitions.concat(newPartition));
    } else {
        return state.__set(x => x.verticalPartitionProviders, partitions => partitions.concat(newPartition));
    }
}

function removeTemplate(state: IConfigurationState, payload: typeof Actions.removePartition.payload): IConfigurationState {
    const { direction, index } = payload;

    if (direction === "horizontal") {
        return state.__set(x => x.horizontalPartitionProviders, partitions => partitions.filter((_, i) => i !== index));
    } else {
        return state.__set(x => x.verticalPartitionProviders, partitions => partitions.filter((_, i) => i !== index));
    }
}

function setName(state: IConfigurationState, name: typeof Actions.setName.payload): IConfigurationState {
    return state.__set(x => x.name, name);
}

function setQuery(state: IConfigurationState, queryId: typeof Actions.setQuery.payload): IConfigurationState {
    return state.__set(x => x.queryId, queryId);
}

function updateInputs(state: IConfigurationState, payload: typeof Actions.updateInputs.payload): IConfigurationState {
    const { index, direction, inputs } = payload;

    if (direction === "horizontal") {
        return state.__set(x => x.horizontalPartitionProviders[index].inputs, inputs);
    } else {
        return state.__set(x => x.verticalPartitionProviders[index].inputs, inputs);
    }
}

export default reducerMap(
    initialState,
    [
        [Actions.setConfig, setConfig],
        [Actions.addPartition, addTemplate],
        [Actions.removePartition, removeTemplate],
        [Actions.setName, setName],
        [Actions.setQuery, setQuery],
        [Actions.updateInputs, updateInputs]
    ]
);