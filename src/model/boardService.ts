import { ExtensionDataService } from "VSS/SDK/Services/ExtensionData";
import { IBoardConfiguration, IItem, PartitionProviderType, IFieldReference } from "./interfaces";
import { FieldReferenceNames } from "./constants";
import { IStaticPartitionProviderInputs } from "./partitionProviders/static";
import getPartitionProvider from "./partitionProviders";
import { WitService } from "../services/witService";

let _config: IBoardConfiguration = {
    id: "boardId",
    queryId: "d598c8b5-3925-4baa-895b-66ec73ff6a81",
    name: "My Board",

    verticalPartitionProviders: [
        // {
        //     type: PartitionProviderType.Parent
        // },
        {
            type: PartitionProviderType.FieldValue,
            inputs: {
                "field": {
                    displayName: "Iteration",
                    referenceName: "System.IterationPath"
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
                    referenceName: FieldReferenceNames.AssignedTo
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
                            referenceName: FieldReferenceNames.State
                        } as IFieldReference,
                        "values": [
                            "Active"
                        ]
                    },
                    {
                        "name": "Resolved",
                        "field": {
                            displayName: "State",
                            referenceName: FieldReferenceNames.State
                        } as IFieldReference,
                        "values": [
                            "Resolved", "Completed"
                        ]
                    }
                ]
            } as IStaticPartitionProviderInputs
        },
    ]
};

// const items = [
//     {
//         id: 1,
//         values: {
//             [FieldReferenceNames.Title]: "As a user I want to use the software",
//             [FieldReferenceNames.State]: "Active",
//             "IsBlocked": "Blocked",
//             "Parent": "Feature 1",
//             "Tags": "Project 1",
//             [FieldReferenceNames.AssignedTo]: "Christopher Schleiden"
//         }
//     },
//     {
//         id: 10,
//         values: {
//             [FieldReferenceNames.Title]: "As a user I want to use the software",
//             [FieldReferenceNames.State]: "Active",
//             "IsBlocked": "Blocked",
//             "Parent": "Feature 1",
//             "Tags": "Project 2",
//             [FieldReferenceNames.AssignedTo]: "Unassigned"
//         }
//     },
//     {
//         id: 11,
//         values: {
//             [FieldReferenceNames.Title]: "As a user I want to use the software",
//             [FieldReferenceNames.State]: "Active",
//             "IsBlocked": "Blocked",
//             "Parent": "Feature 1",
//             "Tags": "Project 1",
//             [FieldReferenceNames.AssignedTo]: "John Doe"
//         }
//     },
//     {
//         id: 2,
//         values: {
//             [FieldReferenceNames.Title]: "As a user I want to use the software",
//             [FieldReferenceNames.State]: "Resolved",
//             "IsBlocked": "Blocked",
//             "Parent": "Feature 1",
//             "Tags": "Project 2",
//             [FieldReferenceNames.AssignedTo]: "Christopher Schleiden"
//         }
//     },
//     {
//         id: 3,
//         values: {
//             [FieldReferenceNames.Title]: "As a user I want to use the software",
//             [FieldReferenceNames.State]: "Active",
//             "IsBlocked": "Not Blocked",
//             "Parent": "Epic 2",
//             "Tags": "Project 1",
//             [FieldReferenceNames.AssignedTo]: "Unassigned"
//         }
//     }
// ];

const RequiredFields: string[] = [
    FieldReferenceNames.Id,
    FieldReferenceNames.Title,
    FieldReferenceNames.WorkItemType,
    FieldReferenceNames.TeamProject
];

export class BoardService {
    async createBoard(): Promise<IBoardConfiguration> {
        return {
            id: "new",
            name: "New Board",
            queryId: "",
            horizontalPartitionProviders: [],
            verticalPartitionProviders: []
        };
    }

    async getBoards(): Promise<IBoardConfiguration[]> {
        return [_config];
    }

    async getBoardConfigurationById(id: string): Promise<IBoardConfiguration> {
        return _config;
    }

    async saveBoardConfiguration(config: IBoardConfiguration): Promise<void> {
        _config = config;
    }

    async getRequiredFields(config: IBoardConfiguration): Promise<string[]> {
        const partitionProviders = [
            ...config.horizontalPartitionProviders,
            ...config.verticalPartitionProviders
        ];

        const result = await Promise.all(partitionProviders.map(p => {
            const provider = getPartitionProvider(p.type);

            return provider.getRequiredFields(p);
        }));

        return result.reduce((r, c) => r.concat(c), []);
    }

    async getItemsForBoard(config: IBoardConfiguration): Promise<{ [id: number]: IItem }> {
        const requiredFieldReferenceNames = await this.getRequiredFields(config);
        const pageFields = RequiredFields.concat(requiredFieldReferenceNames);

        const queryId = config.queryId;

        const witService = new WitService();
        const workItemIds = await witService.runQuery(queryId);
        const workItems = await witService.pageFields(workItemIds, pageFields);

        const workItemMap: { [id: number]: IItem } = {};
        workItems.forEach(workItem => {
            workItemMap[workItem.id] = {
                id: workItem.id,
                values: workItem.fields
            };
        });
        return workItemMap;
    }
}