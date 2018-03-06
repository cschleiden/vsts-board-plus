import * as React from "react";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { ITeamReference, IPartitionProviderTemplateInput } from "../../../model/interfaces";
import { ISelectableOption } from "office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.types";
import { autobind } from "@uifabric/utilities";
import { getClient } from "TFS/Core/RestClient";

export interface ITeamSelectorProps {
    input: IPartitionProviderTemplateInput;

    value: ITeamReference;

    onChanged(value: ITeamReference): void;
}

export interface ITeamSelectorState {
    teams: ITeamReference[];
    loading: boolean;
}

interface ITeamSelectorOption extends ISelectableOption, ITeamReference {
}

export class TeamSelector extends React.PureComponent<ITeamSelectorProps, ITeamSelectorState> {
    constructor(props: ITeamSelectorProps) {
        super(props);

        this.state = {
            teams: [],
            loading: true
        };
    }

    async componentDidMount() {
        const webContext = VSS.getWebContext();
        const teams = await getClient().getTeams(webContext.project.id);

        this.setState({
            teams: teams.map(t => ({
                id: t.id,
                name: t.name
            })),
            loading: false
        });
    }

    render(): JSX.Element {
        const { input, value } = this.props;
        const { loading, teams } = this.state;

        return (
            <Dropdown
                disabled={loading}
                placeHolder={loading && "Loading..."}
                onChanged={this.onChanged}
                label={input.label || "Select team"}
                selectedKey={value && value.id}
                options={teams.map(f => ({
                    ...f,
                    key: f.id,
                    text: f.name
                } as ITeamSelectorOption))}
            />
        );
    }

    @autobind
    private onChanged(option: ITeamSelectorOption) {
        const { onChanged } = this.props;
        if (onChanged) {
            onChanged({
                id: option.id,
                name: option.name
            });
        }
    }
}