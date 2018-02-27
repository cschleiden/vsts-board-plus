import "./partitionProviderListItem.scss";
import * as React from "react";
import { IPartitionProviderConfiguration, IPartitionProviderInputs } from "../../model/interfaces";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { InputComponent } from "./inputs";
import { autobind } from "@uifabric/utilities";
import { getTemplateByType } from "../../data/partitionProviderTemplates";

export interface IPartitionProviderListItemProps {
    config: IPartitionProviderConfiguration;
    index: number;

    onRemove(index: number): void;
    onUpdate(index: number, inputs: IPartitionProviderInputs): void;
}

export class PartitionProviderListItem extends React.Component<IPartitionProviderListItemProps> {
    public render(): JSX.Element {
        const { config } = this.props;
        const { type, inputs } = config;
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
                    {template.inputs.map((input, index) => {
                        if (!input.inputKey) {
                            throw new Error("InputKey required");
                        }

                        return (
                            <InputComponent
                                key={index}
                                input={input}
                                value={inputs}
                                onUpdate={this.onUpdate}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }

    @autobind
    private onUpdate(inputs: IPartitionProviderInputs) {
        const { index, onUpdate } = this.props;

        // const updatedInputs = {
        //     ...config.inputs,
        //     []: value
        // };

        if (onUpdate) {
            onUpdate(index, inputs);
        }
    }

    @autobind
    private onRemove() {
        const { index, onRemove } = this.props;
        if (onRemove) {
            onRemove(index);
        }
    }
}