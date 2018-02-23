import { IBoardConfiguration, IItem, PartitionProviderType, IFieldReference } from "./interfaces";
import { FieldReferenceNames } from "./constants";

export class BoardService {
    getBoardConfigurationById(id: string): Promise<IBoardConfiguration> {
        const config: IBoardConfiguration = {
            id,
            queryId: "someQueryId",
            name: "My Board",

            verticalPartitionProviders: [
                // {
                //     type: PartitionProviderType.Parent
                // },
                {
                    type: PartitionProviderType.FieldValue,
                    inputs: {
                        "field": {
                            displayName: "IsBlocked",
                            referenceName: "IsBlocked"
                        } as IFieldReference
                    }
                }
            ],

            horizontalPartitionProviders: [
                {
                    type: PartitionProviderType.FieldValue,
                    inputs: {
                        "field": {
                            displayName: "Assigned To",
                            referenceName: "Assigned To"
                        } as IFieldReference
                    }
                },
                {
                    type: PartitionProviderType.Static,
                    inputs: {
                        "partitions": [
                            {
                                "name": "Active",
                                "field": {
                                    displayName: "State",
                                    referenceName: "System.State"
                                } as IFieldReference,
                                "values": [
                                    "Active"
                                ]
                            },
                            {
                                "name": "Resolved",
                                "field": {
                                    displayName: "State",
                                    referenceName: "System.State"
                                } as IFieldReference,
                                "values": [
                                    "Resolved", "Completed"
                                ]
                            }
                        ]
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