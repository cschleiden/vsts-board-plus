import "./partitionProviderList.css";
import * as React from "react";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { IPartitionProviderTemplate, IPartitionProviderConfiguration, IPartitionProviderInputs, PartitionProviderType } from "../../model/interfaces";
import { PartitionProviderListItem } from "./partitionProvider";
import templates from "../../data/partitionProviderTemplates";
import { autobind } from "@uifabric/utilities";
import { ISelectableOption } from "office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.types";

interface IListTemplate extends IPartitionProviderTemplate, ISelectableOption {
}

export interface IPartitionProviderListProps {
    partitionProviders: IPartitionProviderConfiguration[];

    onAdd(type: PartitionProviderType): void;
    onRemove(index: number): void;

    onUpdate(indes: number, inputs: IPartitionProviderInputs): void;
}

export class PartitionProviderList extends React.Component<IPartitionProviderListProps> {
    public render(): JSX.Element {
        const { partitionProviders, onUpdate, onRemove } = this.props;

        return (
            <div className="partition-provider-list">
                {partitionProviders.map(
                    (config, index) => (
                        <PartitionProviderListItem key={index} index={index} config={config} onUpdate={onUpdate} onRemove={onRemove} />
                    ))}

                <div className="partition-provider-list--add">
                    <Dropdown
                        label="Add another partition"
                        placeHolder="Select a template"
                        options={templates.map(t => ({
                            ...t,
                            key: t.id
                        }))}
                        onRenderOption={this.renderItem}
                        onChanged={this.addTemplate}
                        selectedKey={null}
                    />
                </div>
            </div>
        );
    }

    @autobind
    private renderItem(item: IListTemplate): JSX.Element {
        return (
            <div className="provider-list-add--item" key={item.key}>
                <div className="provider-list-add--item-name">{item.displayName}</div>
                <div className="provider-list-add--item-description">{item.description}</div>
            </div>
        );
    }

    @autobind
    private addTemplate(template: IListTemplate): void {
        const { onAdd } = this.props;

        onAdd(template.type);

        this.forceUpdate();
    }
}