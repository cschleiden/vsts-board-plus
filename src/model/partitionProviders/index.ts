import { IPartitionProvider, PartitionProviderType } from "../interfaces";
import StaticPartitionProvider from "./static";
import FieldValuePartitionProvider from "./fieldValue";
import ParentPartitionProvider from "./parent";
import TeamPartitionProvider from "./team";
import TeamMembersPartitionProvider from "./teamMembers";

export default function getPartitionProvider(type: PartitionProviderType): IPartitionProvider {
    switch (type) {
        case PartitionProviderType.Static:
            return StaticPartitionProvider;

        case PartitionProviderType.FieldValue:
            return FieldValuePartitionProvider;

        case PartitionProviderType.Parent:
            return ParentPartitionProvider;

        case PartitionProviderType.Team:
            return TeamPartitionProvider;

        case PartitionProviderType.TeamMembers:
            return TeamMembersPartitionProvider;

        default:
            throw new Error("Unknown partition provider");
    }
}