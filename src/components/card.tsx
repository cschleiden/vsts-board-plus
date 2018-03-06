import "./card.scss";
import * as React from "react";
import { IItem } from "../model/interfaces";
import { FieldReferenceNames } from "../model/constants";
import { DraggableProvided } from "react-beautiful-dnd";
import { autobind } from "@uifabric/utilities";
import { WorkItemFormNavigationService } from "TFS/WorkItemTracking/Services";
import { WorkItemTypeColorIcon, WorkItemTypeService } from "../services/workItemTypeService";
import { TypeIcon } from "./typeIcon";
import { Spinner } from "office-ui-fabric-react/lib/Spinner";
import { SpinnerSize } from "office-ui-fabric-react/lib/components/Spinner";

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

export interface ICardState {
    iconAndColor: WorkItemTypeColorIcon;
}

export class Card extends React.Component<ICardProps, ICardState> {
    constructor(props: ICardProps) {
        super(props);

        this.state = {
            iconAndColor: null
        };
    }

    componentWillMount() {
        const { item } = this.props;

        const service = new WorkItemTypeService();
        service.getWorkItemTypeIcon(
            item.values[FieldReferenceNames.TeamProject] as string,
            item.values[FieldReferenceNames.WorkItemType] as string
        ).then(typeColorIcon => {
            this.setState({
                iconAndColor: typeColorIcon
            });
        });
    }

    render(): JSX.Element {
        const { item, draggable, settings = defaultCardSettings } = this.props;
        const { id, values, inProgress, message } = item;

        const { iconAndColor } = this.state;

        const title = values[FieldReferenceNames.Title];

        return (
            <div
                className="card"
                ref={draggable && draggable.innerRef}
                // tslint:disable-next-line:no-any
                {...draggable && (draggable as any).draggableProps}
                {...draggable && draggable.dragHandleProps}
                style={{
                    ...(draggable && (draggable as any).draggableProps.style),
                    borderLeftColor: iconAndColor && `#${iconAndColor.color}`
                }}
            >
                <div className="card--header">
                    <div className="card--icon">
                        {iconAndColor && <TypeIcon icon={iconAndColor} />}
                    </div>
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

                <div className="card--content">
                    {inProgress && <Spinner size={SpinnerSize.small} label={message} />}
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