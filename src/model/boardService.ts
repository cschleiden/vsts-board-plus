import { IBoardConfiguration, IItem, PartitionProviderType, PartitionProviderLegendType } from "./interfaces";
import { FieldReferenceNames } from "./constants";

export class BoardService {
    getBoardConfigurationById(id: string): Promise<IBoardConfiguration> {
        const config: IBoardConfiguration = {
            id,
            name: "My Board",

            verticalPartitionProviders: [
                {
                    type: PartitionProviderType.FieldValue,
                    fieldName: "Parent",
                    displayName: "State",
                    legendType: PartitionProviderLegendType.Card
                },
                {
                    type: PartitionProviderType.FieldValue,
                    fieldName: "IsBlocked",
                    displayName: "Blocked"
                }
            ],

            horizontalPartitionProviders: [
                {
                    type: PartitionProviderType.FieldValue,
                    fieldName: "Assigned To",
                    displayName: "Assigned To"
                },
                {
                    type: PartitionProviderType.Static,
                    fieldName: "State",
                    displayName: "State",
                    inputs: {
                        "values": ["Active", "Resolved", "Closed"]
                    }
                },
            ]
        };

        return Promise.resolve(config);
    }

    getItemsForBoard(config: IBoardConfiguration): Promise<IItem[]> {
        return Promise.resolve(
            [
                {
                    id: 1,
                    values: {
                        [FieldReferenceNames.Title]: "As a user I want to use the software",
                        "State": "Active",
                        "IsBlocked": "Blocked",
                        "Parent": "Feature 1",
                        "Tags": "Project 1",
                        "Assigned To": "Christopher Schleiden"
                    }
                },
                {
                    id: 10,
                    values: {
                        [FieldReferenceNames.Title]: "As a user I want to use the software",
                        "State": "Active",
                        "IsBlocked": "Blocked",
                        "Parent": "Feature 1",
                        "Tags": "Project 2",
                        "Assigned To": "Unassigned"
                    }
                },
                {
                    id: 11,
                    values: {
                        [FieldReferenceNames.Title]: "As a user I want to use the software",
                        "State": "Active",
                        "IsBlocked": "Blocked",
                        "Parent": "Feature 1",
                        "Tags": "Project 1",
                        "Assigned To": "John Doe"
                    }
                },
                {
                    id: 2,
                    values: {
                        [FieldReferenceNames.Title]: "As a user I want to use the software",
                        "State": "Resolved",
                        "IsBlocked": "Blocked",
                        "Parent": "Feature 1",
                        "Tags": "Project 2",
                        "Assigned To": "Christopher Schleiden"
                    }
                },
                {
                    id: 3,
                    values: {
                        [FieldReferenceNames.Title]: "As a user I want to use the software",
                        "State": "Active",
                        "IsBlocked": "Not Blocked",
                        "Parent": "Epic 2",
                        "Tags": "Project 1",
                        "Assigned To": "Unassigned"
                    }
                }
            ]
        );
    }
}