import * as React from "react";

import { Hub } from "vss-ui/Hub";
import { HubHeader } from "vss-ui/HubHeader";
import { HubViewState } from "vss-ui/Utilities/HubViewState";
import { PivotBarItem } from "vss-ui/PivotBar";
// import { IPivotBarAction } from "vss-ui/Components/PivotBar";

export interface IHubComponentProps {

}

export class HubComponent extends React.Component<IHubComponentProps> {
    private hubViewState = new HubViewState();

    public render(): JSX.Element {
        const { children } = this.props;

        return (
            <Hub className="manage-hub" hubViewState={this.hubViewState} hideFullScreenToggle={true}>
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
                                    iconName: "Add"
                                },
                                onClick: () => alert("refresh")
                            },
                            {
                                key: "create",
                                name: "Configure board",
                                important: true,
                                disabled: false,
                                iconProps: {
                                    iconName: "Add"
                                },
                                onClick: () => alert("configure")
                            }
                        ]}
                >
                    {children}
                </PivotBarItem>
            </Hub >
        );
    }
}