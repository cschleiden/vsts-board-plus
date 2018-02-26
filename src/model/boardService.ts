import { IBoardConfiguration, IItem, PartitionProviderType, IFieldReference } from "./interfaces";
import { FieldReferenceNames } from "./constants";
import { IStaticPartitionProviderInputs } from "./partitionProviders/static";
import getPartitionProvider from "./partitionProviders";
import { WitService } from "../services/witService";

let _config: IBoardConfiguration = {
    id: "boardId",
    queryId: "10d9719d-e7f9-4f9a-b08a-f6a49595d563",
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
    FieldReferenceNames.WorkItemType,
    FieldReferenceNames.TeamProject
];

export class BoardService {
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

    async getItemsForBoard(config: IBoardConfiguration): Promise<IItem[]> {
        const requiredFieldReferenceNames = await this.getRequiredFields(config);
        const pageFields = RequiredFields.concat(requiredFieldReferenceNames);

        const queryId = config.queryId;

        const witService = new WitService();
        const workItemIds = await witService.runQuery(queryId);
        const values = await witService.pageFields(workItemIds, pageFields);

        return values.map(v => {
            const id = v[0] as number;

            return {
                id,
                // Transform paged array to dictionary
                values: v.reduce((d, currentValue, index) => d[pageFields[index]] = currentValue, {})
            };
        });
    }
}