import { IPartitionProvider, PartitionProviderType } from "../interfaces";
import StaticPartitionProvider from "./static";
import FieldValuePartitionProvider from "./fieldValue";

export default function getPartitionProvder(type: PartitionProviderType): IPartitionProvider {
    switch (type) {
        case PartitionProviderType.Static:
            return StaticPartitionProvider;

        case PartitionProviderType.FieldValue:
            return FieldValuePartitionProvider;

        default:
            throw new Error("Unknown partition provider");
    }
}