import {
    IPartitionProvider,
    IPartitionProviderConfiguration,
    IPartition,
    IItem,
    PartitionProviderType,
    PartitionProviderLegendType,
    ITeamReference,
    IFieldValueMap
} from "../interfaces";
import { FieldReferenceNames } from "../constants";
import { getClient } from "TFS/Core/RestClient";

/**
 * Partition provider that creates one partition for every unique field value
 */
const TeamMembersPartitionProvider: IPartitionProvider = {
    type: PartitionProviderType.Parent,

    getRequiredFields(configuration: IPartitionProviderConfiguration): Promise<string[]> {
        return Promise.resolve([FieldReferenceNames.AssignedTo]);
    },

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        const team: ITeamReference = configuration.inputs["team"];
        const webContext = VSS.getWebContext();
        return getClient().getTeamMembers(webContext.project.id, team.id).then(members => {
            return members.map(member => ({
                fieldName: FieldReferenceNames.AssignedTo,
                label: member.displayName,
                value: `${member.displayName} <${member.uniqueName}>`,
                tooltip: member.uniqueName,
                legendType: PartitionProviderLegendType.Persona,
                displayData: member
            }));
        }) as Promise<IPartition[]>;
    },

    updateItem(configuration: IPartitionProviderConfiguration, itemId: number, fieldChanges: IFieldValueMap): Promise<void> | void {
    }
};

export default TeamMembersPartitionProvider;