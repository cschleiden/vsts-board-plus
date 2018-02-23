import "./configurationPanel.css";
import * as React from "react";
import { connect } from "react-redux";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { IState } from "../reducers";
import { PartitionProviderList } from "../components/configuration/partitionProviderList";
import { autobind } from "@uifabric/utilities";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button";
import { cancelBoardConfiguration } from "../actions/nav.actionsCreators";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Direction, PartitionProviderType, IPartitionProviderConfiguration } from "../model/interfaces";
import { addTemplate, removeTemplate, updateName, updateQuery } from "../actions/configuration.actionsCreators";

interface IConfigurationPanelProps {
    showPanel: boolean;

    name: string;
    queryId: string;
    horizontalPartitionProviders: IPartitionProviderConfiguration[];
    verticalPartitionProviders: IPartitionProviderConfiguration[];

    close(): void;
    add(direction: Direction, type: PartitionProviderType): void;
    remove(direction: Direction, index: number): void;

    onNameChanged(name: string): void;
    onQueryChanged(queryId: string): void;
}

class ConfigurationPanel extends React.Component<IConfigurationPanelProps> {
    render() {
        const {
            showPanel,
            add,
            remove,
            name,
            queryId,
            horizontalPartitionProviders,
            verticalPartitionProviders,
            onNameChanged,
            onQueryChanged
        } = this.props;

        return (
            <Panel
                isOpen={showPanel}
                headerText="Configure Board"
                type={PanelType.medium}
                isFooterAtBottom={true}
                onRenderFooterContent={this._renderFooter}
            >
                <TextField label="Name" value={name} onChanged={onNameChanged} />
                <TextField label="Query" value={queryId} onChanged={onQueryChanged} />

                <h3>Partitions</h3>

                <h4>Horizontal</h4>
                <PartitionProviderList
                    partitionProviders={horizontalPartitionProviders}
                    onAdd={add.bind(this, "horizontal")}
                    onRemove={remove.bind(this, "horizontal")}
                />

                <h4>Vertical</h4>
                <PartitionProviderList
                    partitionProviders={verticalPartitionProviders}
                    onAdd={add.bind(this, "vertical")}
                    onRemove={remove.bind(this, "vertical")}
                />
            </Panel>
        );
    }

    @autobind
    private _renderFooter(): JSX.Element {
        const { close } = this.props;

        return (
            <div className="configure-panel--footer">
                <PrimaryButton>
                    Save
                </PrimaryButton>
                <DefaultButton onClick={close}>
                    Cancel
                </DefaultButton>
            </div>
        );
    }
}

export default connect(
    (state: IState) => {
        const { name, queryId, horizontalPartitionProviders, verticalPartitionProviders } = state.configuration;

        return {
            showPanel: state.nav.configurationOpen,
            name,
            queryId,
            horizontalPartitionProviders,
            verticalPartitionProviders
        };
    },
    (dispatch) => ({
        close: () => { dispatch(cancelBoardConfiguration("test")); },

        add: (direction: Direction, type: PartitionProviderType) => { dispatch(addTemplate(direction, type)); },
        remove: (direction: Direction, index: number) => { dispatch(removeTemplate(direction, index)); },

        onNameChanged: (name: string) => { dispatch(updateName(name)); },
        onQueryChanged: (queryId: string) => { dispatch(updateQuery(queryId)); }
    })
)(ConfigurationPanel);