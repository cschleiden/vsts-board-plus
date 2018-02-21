import * as React from "react";

import { DefaultLegend } from "./default";
import { CardLegend } from "./card";
import { PartitionProviderLegendType } from "../../model/interfaces";

export interface ILegendProps {
    type: PartitionProviderLegendType;

    label: string;

    vertical?: boolean;
}

export class Legend extends React.PureComponent<ILegendProps> {
    render() {
        const { type, label, vertical } = this.props;

        switch (type) {
            default:
            case PartitionProviderLegendType.Text:
                return (
                    <DefaultLegend label={label} vertical={vertical} />
                );

            case PartitionProviderLegendType.Card:
                return (
                    <CardLegend label={label} />
                );
        }
    }
}