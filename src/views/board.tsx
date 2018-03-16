import * as React from "react";
import { Hub } from "vss-ui/Hub";
import { HubHeader } from "vss-ui/HubHeader";
import { HubViewState } from "vss-ui/Utilities/HubViewState";
import { PivotBarItem } from "vss-ui/PivotBar";
import { autobind } from "@uifabric/utilities";
import { connect } from "react-redux";
import { configureBoard, switchView } from "../actions/nav.actionsCreators";
import BoardPivot from "../components/boardPivot";
import ConfigurationPanel from "./configurationPanel";
import { IBoardConfiguration } from "../model/interfaces";
import { IState } from "../reducers";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

interface IBoardProps {
    board: IBoardConfiguration;

    configure(): void;
    goToDirectory(): void;
}

class Board extends React.Component<IBoardProps> {
    private hubViewState = new HubViewState();

    render(): JSX.Element {
        const { board } = this.props;

        return (
            <Hub className="board-hub" hubViewState={this.hubViewState} hideFullScreenToggle={true}>
                <HubHeader
                    title={board && board.name}
                    breadcrumbItems={
                        [
                            {
                                key: "directory",
                                text: "Boards+",
                                onClick: this.goToDirectory
                            }
                        ]
                    }
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

                    {!board && <Spinner size={SpinnerSize.large} />}
                    {board && <BoardPivot />}

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

    @autobind
    private goToDirectory() {
        const { goToDirectory } = this.props;
        goToDirectory();
    }
}

export default connect(
    (state: IState) => {
        const { config } = state.board;

        return {
            board: config
        };
    },
    (dispatch) => ({
        configure: () => { dispatch(configureBoard("test")); },
        goToDirectory: () => { dispatch(switchView("directory")); }
    })
)(Board);
