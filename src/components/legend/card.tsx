import * as React from "react";
import { Card } from "../card";
import { IItem } from "../../model/interfaces";
import { FieldReferenceNames } from "../../model/constants";

export interface ICardLegendProps {
    label: string;

    item: IItem;
}

export class CardLegend extends React.PureComponent<ICardLegendProps> {
    public render(): JSX.Element {
        const { label, item } = this.props;

        return (
            <Card
                item={item}
                settings={{
                    showId: false
                }}
            />
        );
    }
}