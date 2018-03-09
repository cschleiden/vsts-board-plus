import { IPartitionProvider, PartitionProviderType } from "../interfaces";
import StaticPartitionProvider from "./static";
import FieldValuePartitionProvider from "./fieldValue";
import ParentPartitionProvider from "./parent";
import TeamPartitionProvider from "./team";
import TeamMembersPartitionProvider from "./teamMembers";
import StarPartitionProvider from "./star";

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

        case PartitionProviderType.Star:
            return StarPartitionProvider;

        default:
            throw new Error("Unknown partition provider");
    }
}