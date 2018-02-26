import {
    IPartitionProvider,
    IPartition,
    IPartitionProviderConfiguration,
    IItem,
    PartitionProviderType,
    IFieldReference,
    PartitionProviderLegendType
} from "../interfaces";

export interface IStaticPartitionProviderInputs {
    partitions: {
        name: string;
        field: IFieldReference;
        values: string[];
    }[];
}

const Provider: IPartitionProvider = {
    type: PartitionProviderType.Static,

    getRequiredFields(configuration: IPartitionProviderConfiguration): Promise<string[]> {
        const inputs = configuration.inputs as IStaticPartitionProviderInputs;

        return Promise.resolve(inputs.partitions.map(p => p.field.referenceName));
    },

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        /*
        Inputs are defined in the following structure:
        "partitions": [
            {
                "name": "Active",
                "field": {
                    displayName: "State",
                    referenceName: "System.State"
                } as IFieldReference,
                "values": [
                    "Active"
                ]
            },
            {
                "name": "Resolved",
                "field": {
                    displayName: "State",
                    referenceName: "System.State"
                } as IFieldReference,
                "values": [
                    "Resolved", "Completed"
                ]
            }
        ]
        */

        const inputs = configuration.inputs as IStaticPartitionProviderInputs;

        return Promise.resolve(inputs.partitions.map(partition => ({
            label: partition.name,
            value: partition.values[0],
            fieldName: partition.field.referenceName,
            legendType: PartitionProviderLegendType.Text
        })));
    }
};

export default Provider;