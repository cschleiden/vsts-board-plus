import {
    IPartitionProvider,
    IPartitionProviderConfiguration,
    IPartition,
    IItem,
    PartitionProviderType,
    PartitionProviderLegendType,
    IFieldValueMap
} from "../interfaces";
import { WitService } from "../../services/witService";
import { FieldReferenceNames } from "../constants";

const FieldName = "Board.Parent";

/**
 * Partition provider that creates one partition for every unique field value
 */
const ParentPartitionProvider: IPartitionProvider = {
    type: PartitionProviderType.Parent,

    getRequiredFields(configuration: IPartitionProviderConfiguration): Promise<string[]> {
        // TODO: Run extra query here to determine parent for items?
        return Promise.resolve([]);
    },

    async getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        const ids = items.map(item => item.id);
        const itemMap: { [id: number]: IItem } = items.reduce((map, item) => { map[item.id] = item; return map; }, {});

        const witService = new WitService();
        const wiql = `SELECT [System.Id] FROM WorkItemLinks WHERE ([Target].[System.Id] IN (${ids.join()})) AND ([System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward') mode(MustContain)`;
        const queryResult = await witService.runQueryText(wiql);

        const parentIdsSet = new Set<number>();
        for (const { source, target } of queryResult.workItemRelations) {
            const parentId = source && source.id || 0;

            itemMap[target.id].values[FieldName] = parentId;

            parentIdsSet.add(parentId);
        }

        const parentIds = Array.from(parentIdsSet.keys());
        var parentValues = await witService.pageFields(
            parentIds.filter(id => id > 0),
            [
                FieldReferenceNames.Id,
                FieldReferenceNames.Title,
                FieldReferenceNames.TeamProject,
                FieldReferenceNames.WorkItemType
            ]
        );

        const partitions = parentValues.map(parentWorkItem => ({
            fieldName: FieldName,
            label: "Parent",
            value: parentWorkItem.id,
            legendType: PartitionProviderLegendType.Card,
            displayData: {
                id: parentWorkItem.id,
                values: parentWorkItem.fields
            } as IItem
        } as IPartition));

        partitions.unshift({
            fieldName: FieldName,
            label: "Parent",
            value: 0,
            legendType: PartitionProviderLegendType.Card,
            displayData: {
                id: 0,
                values: {
                    [FieldReferenceNames.Title]: "Unparented"
                }
            }
        });

        return partitions;
    },

    async updateItem(configuration: IPartitionProviderConfiguration, itemId: number, fieldChanges: IFieldValueMap): Promise<void> {
        if (fieldChanges[FieldName]) {
            const newParentId: number = fieldChanges[FieldName] as number;

            var witService = new WitService();
            await witService.updateParent(itemId, newParentId);

            delete fieldChanges[FieldName];
        }
    }
};

export default ParentPartitionProvider;