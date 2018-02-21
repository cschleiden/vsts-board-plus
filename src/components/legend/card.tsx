import * as React from "react";
import { Card } from "../card";
import { IItem } from "../../model/interfaces";
import { FieldReferenceNames } from "../../model/constants";

export interface ICardLegendProps {
    label: string;
}

export class CardLegend extends React.PureComponent<ICardLegendProps> {
    public render(): JSX.Element {
        const { label } = this.props;

        const legendItem: IItem = {
            id: -42,
            values: {
                [FieldReferenceNames.Title]: label
            }
        };

        return (
            <Card
                item={legendItem}
                settings={{
                    showId: false
                }}
            />
        );
    }
}