import "./card.css";
import * as React from "react";
import { IItem } from "../model/interfaces";
import { FieldReferenceNames } from "../model/constants";
import { DraggableProvided } from "react-beautiful-dnd";

export interface ICardSettings {
    showId?: boolean;
}

const defaultCardSettings: ICardSettings = {
    showId: true
};

export interface ICardProps {
    item: IItem;

    draggable?: DraggableProvided;

    settings?: ICardSettings;
}

export class Card extends React.PureComponent<ICardProps> {
    public render(): JSX.Element {
        const { item, draggable, settings = defaultCardSettings } = this.props;
        const { id, values } = item;

        const title = values[FieldReferenceNames.Title];

        return (
            <div
                className="card"
                ref={draggable && draggable.innerRef}
                style={draggable && draggable.draggableStyle}
                // tslint:disable-next-line:no-any
                {...draggable && (draggable as any).draggableProps}
                {...draggable && draggable.dragHandleProps}
            >
                <div className="card--header">
                    {
                        settings.showId && (
                            <div className="card--id">
                                {id}
                            </div>
                        )
                    }
                    <div className="card--title">
                        {title || ""}
                    </div>
                </div>
            </div>
        );
    }
}