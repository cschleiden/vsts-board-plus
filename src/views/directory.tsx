import * as React from "react";
import { IBoardConfiguration } from "../model/interfaces";
import { Hub } from "vss-ui/Hub";
import { HubViewState } from "vss-ui/Utilities/HubViewState";
import { HubHeader } from "vss-ui/HubHeader";
import { PivotBarItem } from "vss-ui/PivotBar";
import { DetailsList, SelectionMode } from "office-ui-fabric-react/lib/DetailsList";
import { connect } from "react-redux";
import { IState } from "../reducers";
import { initDirectory } from "../actions/directory.actionsCreators";
import { autobind } from "@uifabric/utilities";
import { initBoard } from "../actions/board.actionsCreator";

interface DirectoryViewProps {
    boards: IBoardConfiguration[];

    init(): void;
    openBoard(boardId: string): void;
}

class DirectoryView extends React.Component<DirectoryViewProps> {
    private hubViewState = new HubViewState();

    componentWillMount() {
        const { init } = this.props;

        init();
    }

    render(): JSX.Element {
        const { boards } = this.props;

        return (
            <Hub className="directory-hub" hubViewState={this.hubViewState} hideFullScreenToggle={false}>
                <HubHeader
                    title={"Boards+"}
                />

                <PivotBarItem
                    name="Board+"
                    itemKey="directory"
                    commands={
                        [
                            {
                                key: "create",
                                name: "Create board",
                                important: true,
                                disabled: false,
                                iconProps: {
                                    iconName: "Add"
                                }
                            }
                        ]}
                >

                    <DetailsList
                        items={boards}
                        selectionMode={SelectionMode.single}
                        onItemInvoked={this.openBoard}
                        columns={[
                            {
                                key: "name",
                                fieldName: "name",
                                name: "Name",
                                minWidth: 200,
                                onRender: this.renderName
                            }
                        ]}
                    />
                </PivotBarItem>
            </Hub >
        );
    }

    @autobind
    private renderName(item: IBoardConfiguration) {
        return (
            <a href="#" onClick={() => this.openBoard(item)}>{item.name}</a>
        );
    }

    @autobind
    private openBoard(item: IBoardConfiguration) {
        const { openBoard } = this.props;
        openBoard(item.id);
    }
}

export default connect(
    (state: IState) => {
        const { boards } = state.directory;

        return {
            boards
        };
    },
    (dispatch) => ({
        init: () => { dispatch(initDirectory()); },
        openBoard: (boardId: string) => { dispatch(initBoard(boardId)); }
    })
)(DirectoryView);