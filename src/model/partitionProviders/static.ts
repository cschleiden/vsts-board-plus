import { IPartitionProvider, IPartition, IPartitionProviderConfiguration, IItem, PartitionProviderType } from "../interfaces";

const Provider: IPartitionProvider = {
    type: PartitionProviderType.Static,
    
    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        const values: string[] = configuration.inputs["values"];

        return Promise.resolve(values.map(value => ({
            label: value.toString(),
            value,
            fieldName: configuration.fieldName,
            legendType: configuration.legendType
        })));
    }
};

export default Provider;