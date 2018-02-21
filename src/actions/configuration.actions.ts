import { makeAction } from "./actions";
import { IPartitionProviderTemplate } from "../model/interfaces";

export const addTemplate = makeAction<{
    direction: "horizontal" | "vertical";
    template: IPartitionProviderTemplate;
}>("config-add-template");

export const removeTemplate = makeAction<{
    direction: "horizontal" | "vertical";
    template: IPartitionProviderTemplate;
}>("config-remove-template");

export const setName = makeAction<string>("config-set-name");

export const setQuery = makeAction<string>("config-set-query");