import { IPartitionProvider, PartitionProviderType } from "../interfaces";
import StaticPartitionProvider from "./static";
import FieldValuePartitionProvider from "./fieldValue";
import ParentPartitionProvider from "./parent";

export default function getPartitionProvder(type: PartitionProviderType): IPartitionProvider {
    switch (type) {
        case PartitionProviderType.Static:
            return StaticPartitionProvider;

        case PartitionProviderType.FieldValue:
            return FieldValuePartitionProvider;

        case PartitionProviderType.Parent:
            return ParentPartitionProvider;

        default:
            throw new Error("Unknown partition provider");
    }
}