import * as React from "react";

import { DefaultLegend } from "./default";
import { CardLegend } from "./card";
import { PartitionProviderLegendType } from "../../model/interfaces";
import { PersonaLegend } from "./persona";

export interface ILegendProps {
    type: PartitionProviderLegendType;

    label: string;

    vertical?: boolean;

    displayData?: any;
}

export class Legend extends React.PureComponent<ILegendProps> {
    render() {
        const { type, label, vertical, displayData } = this.props;

        switch (type) {
            default:
            case PartitionProviderLegendType.Text:
                return (
                    <DefaultLegend label={label} vertical={vertical} />
                );

            case PartitionProviderLegendType.Card:
                return (
                    <CardLegend label={label} item={displayData} />
                );

            case PartitionProviderLegendType.Persona:
                return (
                    <PersonaLegend label={label} identityRef={displayData} />
                );
        }
    }
}