import { IPartitionProvider, IPartition, IPartitionProviderConfiguration, IItem } from "../interfaces";

const Provider: IPartitionProvider = {
    type: "static",

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        const values: string[] = configuration.inputs["values"];

        return Promise.resolve(values.map(value => ({
            label: value.toString(),
            value,
            fieldName: configuration.fieldName
        })));
    }
};

export default Provider;