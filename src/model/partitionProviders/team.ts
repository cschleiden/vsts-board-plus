import {
    IPartitionProvider,
    IPartitionProviderConfiguration,
    IPartition,
    IItem,
    PartitionProviderType,
    PartitionProviderLegendType
} from "../interfaces";

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
                fieldName: "Team",
                label: "Team",
                value: null,
                legendType: PartitionProviderLegendType.Text,
            } as IPartition]
        );
    }
};

export default TeamPartitionProvider;