import {
    IPartitionProvider,
    IPartitionProviderConfiguration,
    IPartition,
    IItem,
    PartitionProviderType,
    PartitionProviderLegendType,
    IFieldValueMap
} from "../interfaces";
import { FieldReferenceNames } from "../constants";

/**
 * Partition provider that creates one partition for every unique field value
 */
const TeamPartitionProvider: IPartitionProvider = {
    type: PartitionProviderType.Parent,

    getRequiredFields(configuration: IPartitionProviderConfiguration): Promise<string[]> {
        return Promise.resolve([]);
    },

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        return Promise.resolve(
            [{
                fieldName: FieldReferenceNames.AreaPath,
                label: "Team",
                value: null,
                legendType: PartitionProviderLegendType.Text,
            } as IPartition]
        );
    },

    updateItem(configuration: IPartitionProviderConfiguration, itemId: number, fieldChanges: IFieldValueMap): Promise<void> | void {
        // TODO
    }
};

export default TeamPartitionProvider;