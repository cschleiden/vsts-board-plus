import {
    IPartitionProvider,
    IPartitionProviderConfiguration,
    IPartition,
    IItem,
    PartitionProviderType,
    IFieldReference,
    PartitionProviderLegendType,
    IFieldValueMap
} from "../interfaces";

/**
 * Partition provider that creates one partition and contains ever item
 */
const StarPartitionProvider: IPartitionProvider = {
    type: PartitionProviderType.FieldValue,

    getRequiredFields(configuration: IPartitionProviderConfiguration): Promise<string[]> {
        return Promise.resolve([]);
    },

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        const label: string = configuration.inputs["label"];

        return Promise.resolve(
            [{
                label,
                value: null,
                fieldName: null,
                legendType: PartitionProviderLegendType.Text
            }]
        );
    },

    updateItem(configuration: IPartitionProviderConfiguration, itemId: number, fieldChanges: IFieldValueMap): Promise<void> | void {
        // Do nothing, generic update code will handle this
    }
};

export default StarPartitionProvider;