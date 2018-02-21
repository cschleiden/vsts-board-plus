import "./partitionProviderListItem.css";
import * as React from "react";
import { IPartitionProviderTemplate } from "../../model/interfaces";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { InputComponent } from "./inputs";
import { autobind } from "@uifabric/utilities";

export interface IPartitionProviderListItemProps {
    template: IPartitionProviderTemplate;

    onRemove?(template: IPartitionProviderTemplate): void;
}

export class PartitionProviderListItem extends React.Component<IPartitionProviderListItemProps> {
    public render(): JSX.Element {
        const { template } = this.props;

        return (
            <div className="partition-provider-list-item">
                <div className="partition-provider-list-item-wrapper">
                    <div className="partition-provider-list-item--index" />
                    <div className="partition-provider-list-item--name">
                        {template.displayName}
                    </div>

                    <div className="partition-provider-list-item--actions">
                        <IconButton
                            iconProps={{
                                iconName: "Delete"
                            }}
                            title="Remove"
                            onClick={this.onRemove}
                        />
                    </div>
                </div>

                <div className="partition-provider-list-item-inputs">
                    {template.inputs.map((input, index) => (
                        <InputComponent
                            key={index}
                            input={input}
                        />))}
                </div>
            </div>
        );
    }

    @autobind
    private onRemove() {
        const { template, onRemove } = this.props;
        if (onRemove) {
            onRemove(template);
        }
    }
}