import "./partitionProviderListItem.css";
import * as React from "react";
import { IPartitionProviderConfiguration } from "../../model/interfaces";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { InputComponent } from "./inputs";
import { autobind } from "@uifabric/utilities";
import { getTemplateByType } from "../../data/partitionProviderTemplates";

export interface IPartitionProviderListItemProps {
    config: IPartitionProviderConfiguration;
    index: number;
    onRemove?(index: number): void;
}

export class PartitionProviderListItem extends React.Component<IPartitionProviderListItemProps> {
    public render(): JSX.Element {
        const { config } = this.props;
        const { type } = config;
        const template = getTemplateByType(type);

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
                        />
                    ))}
                </div>
            </div>
        );
    }

    @autobind
    private onRemove() {
        const { index, onRemove } = this.props;
        if (onRemove) {
            onRemove(index);
        }
    }
}