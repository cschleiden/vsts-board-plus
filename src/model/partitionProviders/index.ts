import { IPartitionProvider } from "../interfaces";
import StaticPartitionProvider from "./static";
import FieldValuePartitionProvider from "./fieldValue";

export default function getPartitionProvder(type: string): IPartitionProvider {
    switch (type) {
        case StaticPartitionProvider.type:
            return StaticPartitionProvider;

        case FieldValuePartitionProvider.type:
            return FieldValuePartitionProvider;

        default:
            throw new Error("Unknown partition provider");
    }
}