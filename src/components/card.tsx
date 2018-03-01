import "./card.scss";
import * as React from "react";
import { IItem } from "../model/interfaces";
import { FieldReferenceNames } from "../model/constants";
import { DraggableProvided } from "react-beautiful-dnd";
import { autobind } from "@uifabric/utilities";
import { WorkItemFormNavigationService } from "TFS/WorkItemTracking/Services";

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

export class Card extends React.Component<ICardProps> {
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
                        <a href="" onClick={this.openWorkItem}>{title || ""}</a>
                    </div>
                </div>
            </div>
        );
    }

    @autobind
    private openWorkItem(ev: React.MouseEvent<HTMLAnchorElement>) {
        const { item } = this.props;

        if (!ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
            WorkItemFormNavigationService.getService().then(service => {
                service.openWorkItem(item.id);
            });

            ev.preventDefault();
        }
    }
}