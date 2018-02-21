import * as React from "react";
import { Hub } from "vss-ui/Hub";
import { HubHeader } from "vss-ui/HubHeader";
import { HubViewState } from "vss-ui/Utilities/HubViewState";
import { PivotBarItem } from "vss-ui/PivotBar";
import { autobind } from "@uifabric/utilities";
import { connect } from "react-redux";
import { configureBoard } from "../actions/nav.actionsCreators";
import BoardPivot from "../components/boardPivot";
import ConfigurationPanel from "./configurationPanel";

interface IMainProps {
    configure(): void;
}

class Main extends React.Component<IMainProps> {
    private hubViewState = new HubViewState();

    public render(): JSX.Element {
        return (
            <Hub className="manage-hub" hubViewState={this.hubViewState} hideFullScreenToggle={false}>
                <HubHeader
                    title={"Board+"}
                />

                <PivotBarItem
                    name="Board+"
                    itemKey="main"
                    commands={
                        [
                            {
                                key: "refresh",
                                name: "Refresh",
                                important: true,
                                disabled: false,
                                iconProps: {
                                    iconName: "Refresh"
                                },
                                onClick: () => alert("refresh")
                            },
                            {
                                key: "create",
                                name: "Configure board",
                                important: true,
                                disabled: false,
                                iconProps: {
                                    iconName: "Settings"
                                },
                                onClick: this._configure
                            }
                        ]}
                >

                    <BoardPivot />

                    <ConfigurationPanel />
                </PivotBarItem>
            </Hub >
        );
    }

    @autobind
    private _configure() {
        const { configure } = this.props;
        if (configure) {
            configure();
        }
    }
}

export default connect(null, (dispatch) => ({
    configure: () => { dispatch(configureBoard("test")); }
}))(Main);
