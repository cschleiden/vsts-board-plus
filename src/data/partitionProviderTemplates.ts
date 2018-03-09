import { IPartitionProviderTemplate, PartitionProviderLegendType, PartitionProviderType } from "../model/interfaces";
import { TemplateInputTypes } from "../model/configuration/inputs";

const templates: IPartitionProviderTemplate[] = [
    {
        id: "fieldValue",
        displayName: "Field Value",
        description: "Generates a partition for every unique field value of the work items on the board for a given field.",
        inputs: [
            {
                type: TemplateInputTypes.Field,
                inputKey: "field"
            }
        ],
        legendType: PartitionProviderLegendType.Text,
        type: PartitionProviderType.FieldValue
    },
    {
        id: "star",
        displayName: "Catch-All",
        description: "Generates a single partition that accepts every work item.",
        inputs: [
            {
                type: TemplateInputTypes.TextInput,
                label: "Label",
                inputKey: "label"
            }
        ],
        legendType: PartitionProviderLegendType.Text,
        type: PartitionProviderType.Star
    },
    {
        id: "static",
        displayName: "Static",
        description: "Generates manually configured partitions.",
        inputs: [
            {
                type: TemplateInputTypes.Group,
                inputKey: "partitions",
                label: "Partitions",
                description: "This is the description",
                group: [
                    {
                        type: TemplateInputTypes.TextInput,
                        label: "Display Name",
                        inputKey: "name"
                    },
                    {
                        type: TemplateInputTypes.Field,
                        inputKey: "field"
                    },
                    {
                        type: TemplateInputTypes.Group,
                        inputKey: "values",
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
                type: TemplateInputTypes.Team,
                inputKey: "team"
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
                type: TemplateInputTypes.Group,
                inputKey: "teams",
                label: "Teams",
                group: [
                    {
                        type: TemplateInputTypes.Team
                    }
                ]
            }
        ],
        legendType: PartitionProviderLegendType.Text,
        type: PartitionProviderType.Iterations
    },
];

export function getTemplateByType(type: PartitionProviderType): IPartitionProviderTemplate {
    const result = templates.filter(t => t.type === type);
    return result.length > 0 && result[0] || null;
}

export default templates;