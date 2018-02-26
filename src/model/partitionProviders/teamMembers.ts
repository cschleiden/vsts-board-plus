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
const TeamMembersPartitionProvider: IPartitionProvider = {
    type: PartitionProviderType.Parent,

    getRequiredFields(configuration: IPartitionProviderConfiguration): Promise<string[]> {
        return Promise.resolve([]);
    },

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        return Promise.resolve(
            [
                {
                    fieldName: "TeamMembers",
                    label: "Christopher Schleiden",
                    value: "Christopher Schleiden",
                    legendType: PartitionProviderLegendType.Text,
                },
                {
                    fieldName: "TeamMembers",
                    label: "John Doe",
                    value: "John Doe",
                    legendType: PartitionProviderLegendType.Text,
                }
            ] as IPartition[]
        );
    }
};

export default TeamMembersPartitionProvider;