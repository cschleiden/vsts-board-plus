import {
    IPartitionProvider,
    IPartitionProviderConfiguration,
    IPartition,
    IItem,
    PartitionProviderType,
    IFieldReference,
    PartitionProviderLegendType
} from "../interfaces";

/**
 * Partition provider that creates one partition for every unique field value
 */
const FieldValuePartitionProvider: IPartitionProvider = {
    type: PartitionProviderType.FieldValue,

    getRequiredFields(configuration: IPartitionProviderConfiguration): string[] {
        const fieldReference: IFieldReference = configuration.inputs["field"];

        return [fieldReference.referenceName];
    },

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        const fieldReference: IFieldReference = configuration.inputs["field"];

        const set = new Set(items.map(item => item.values[fieldReference.referenceName]));

        return Promise.resolve(
            Array.from(set).map(value => ({
                label: value && value.toString() || "",
                value: value.toString(),
                fieldName: fieldReference.referenceName,
                legendType: PartitionProviderLegendType.Text
            }))
        );
    }
};

export default FieldValuePartitionProvider;