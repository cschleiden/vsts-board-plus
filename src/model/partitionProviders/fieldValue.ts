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
 * Partition provider that creates one partition for every unique field value
 */
const FieldValuePartitionProvider: IPartitionProvider = {
    type: PartitionProviderType.FieldValue,

    getRequiredFields(configuration: IPartitionProviderConfiguration): Promise<string[]> {
        const fieldReference: IFieldReference = configuration.inputs["field"];

        return Promise.resolve([fieldReference.referenceName]);
    },

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        const fieldReference: IFieldReference = configuration.inputs["field"];

        const set = new Set(items.map(item => item.values[fieldReference.referenceName]));

        return Promise.resolve(
            Array.from(set).map(value => ({
                label: value && value.toString() || "",
                value: value && value.toString(),
                fieldName: fieldReference.referenceName,
                legendType: PartitionProviderLegendType.Text
            }))
        );
    },

    updateItem(configuration: IPartitionProviderConfiguration, itemId: number, fieldChanges: IFieldValueMap): Promise<void> | void {
        // Do nothing, generic update code will handle this
    }
};

export default FieldValuePartitionProvider;