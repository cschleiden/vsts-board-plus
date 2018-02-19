import * as React from "react";
import { IItem } from "../model/interfaces";
import { FieldReferenceNames } from "../model/constants";
import { DraggableProvided } from "react-beautiful-dnd";

export interface ICardProps {
    item: IItem;

    draggable?: DraggableProvided;
}

export class Card extends React.PureComponent<ICardProps> {
    public render(): JSX.Element {
        const { item, draggable } = this.props;
        const { id, values } = item;

        const title = values[FieldReferenceNames.Title];

        return (
            <div
                className="item"
                ref={draggable.innerRef}
                style={draggable.draggableStyle}
                // tslint:disable-next-line:no-any
                {...(draggable as any).draggableProps}
                {...draggable.dragHandleProps}
            >
                <div className="item--id">
                    {id}
                </div>
                <div className="item--title">
                    {title || ""}
                </div>
            </div>
        );
    }
}