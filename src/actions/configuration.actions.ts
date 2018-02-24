import { makeAction } from "./actions";
import { PartitionProviderType, IBoardConfiguration, Direction, IPartitionProviderInputs } from "../model/interfaces";

export const setConfig = makeAction<IBoardConfiguration>("config-set");

export const addPartition = makeAction<{
    direction: Direction;
    type: PartitionProviderType;
}>("config-add-partition");

export const removePartition = makeAction<{
    direction: Direction;
    index: number;
}>("config-remove-partition");

export const setName = makeAction<string>("config-set-name");

export const setQuery = makeAction<string>("config-set-query");

export const updateInputs = makeAction<{
    direction: Direction;
    index: number;
    inputs: IPartitionProviderInputs;
}>("config-update-inputs");