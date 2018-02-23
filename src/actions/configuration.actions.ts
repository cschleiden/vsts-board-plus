import { makeAction } from "./actions";
import { PartitionProviderType, IBoardConfiguration } from "../model/interfaces";

export const setConfig = makeAction<IBoardConfiguration>("config-set");

export const addPartition = makeAction<{
    direction: "horizontal" | "vertical";
    type: PartitionProviderType;
}>("config-add-partition");

export const removePartition = makeAction<{
    direction: "horizontal" | "vertical";
    index: number;
}>("config-remove-partition");

export const setName = makeAction<string>("config-set-name");

export const setQuery = makeAction<string>("config-set-query");