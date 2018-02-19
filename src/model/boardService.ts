import { IBoardConfiguration, IItem } from "./interfaces";

export class BoardService {
    getBoardConfigurationById(id: string): Promise<IBoardConfiguration> {
        const config: IBoardConfiguration = {
            id,
            name: "My Board",

            verticalPartitionProviders: [
                {
                    type: "fieldValue",
                    fieldName: "Parent",
                    displayName: "State"
                }
            ],

            horizontalPartitionProviders: [
                {
                    type: "static",
                    fieldName: "State",
                    displayName: "State",
                    inputs: {
                        "values": ["Active", "Resolved", "Closed"]
                    }
                }
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
                        "State": "Active",
                        "IsBlocked": "Blocked",
                        "Parent": "Feature 1"
                    }
                },
                {
                    id: 10,
                    values: {
                        "State": "Active",
                        "IsBlocked": "Blocked",
                        "Parent": "Feature 1"
                    }
                },
                {
                    id: 11,
                    values: {
                        "State": "Active",
                        "IsBlocked": "Blocked",
                        "Parent": "Feature 1"
                    }
                },
                {
                    id: 2,
                    values: {
                        "State": "Resolved",
                        "IsBlocked": "Blocked",
                        "Parent": "Feature 1"
                    }
                },
                {
                    id: 3,
                    values: {
                        "State": "Active",
                        "IsBlocked": "Not Blocked",
                        "Parent": "Epic 2"
                    }
                }
            ]
        );
    }
}