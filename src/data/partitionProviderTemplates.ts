import { IPartitionProviderTemplate, PartitionProviderLegendType, PartitionProviderType } from "../model/interfaces";
import { TemplateInputTypes } from "../model/configuration/inputs";

const templates: IPartitionProviderTemplate[] = [
    {
        id: "fieldValue",
        displayName: "Field Value",
        description: "Generates a partition for every unique field value of the work items on the board for a given field.",
        inputs: [
            {
                type: TemplateInputTypes.FieldReferenceName
            }
        ],
        legendType: PartitionProviderLegendType.Text,
        type: PartitionProviderType.FieldValue
    },
    {
        id: "static",
        displayName: "Static",
        description: "Generates manually configured partitions.",
        inputs: [
            {
                type: TemplateInputTypes.Group,
                label: "Partitions",
                group: [
                    {
                        type: TemplateInputTypes.TextInput,
                        label: "Partition Name"
                    },
                    {
                        type: TemplateInputTypes.FieldReferenceName
                    },
                    {
                        type: TemplateInputTypes.Group,
                        label: "Field Values (OR)",
                        group: [
                            {
                                type: TemplateInputTypes.TextInput
                            }
                        ]
                    }
                ],
                multiple: true
            }
        ],
        legendType: PartitionProviderLegendType.Text,
        type: PartitionProviderType.Static
    },
    {
        id: "parent",
        displayName: "Parent Work Item",
        description: "Generates a partition for every unique parent work item of the work items on the board.",
        inputs: [],
        legendType: PartitionProviderLegendType.Card,
        type: PartitionProviderType.Parent
    },

    // TODO: These are aspirational, recorded here to drive design decisions
    {
        id: "teamMembers",
        displayName: "Team Members",
        description: "Generates a partition for every direct member of the given team.",
        inputs: [
            {
                type: TemplateInputTypes.Team
            }
        ],
        legendType: PartitionProviderLegendType.Card,
        type: PartitionProviderType.TeamMembers
    },
    {
        id: "iterations",
        displayName: "Iterations",
        description: "Generates partitions for all of the iterations the given teams have subscribed to, sorted by their start dates.",
        inputs: [
            {
                type: TemplateInputTypes.Team,
                multiple: true
            }
        ],
        legendType: PartitionProviderLegendType.Text,
        type: PartitionProviderType.Iterations
    },
];

export default templates;