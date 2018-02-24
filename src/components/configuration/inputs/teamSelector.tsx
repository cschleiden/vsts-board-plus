import * as React from "react";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { ITeamReference, IPartitionProviderTemplateInput } from "../../../model/interfaces";
import { ISelectableOption } from "office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.types";
import { autobind } from "@uifabric/utilities";

export interface ITeamSelectorProps {
    input: IPartitionProviderTemplateInput;

    value: string;

    onChanged(value: ITeamReference): void;
}

export interface ITeamSelectorState {
    teams: ITeamReference[];
}

interface ITeamSelectorOption extends ISelectableOption, ITeamReference {
}

export class TeamSelector extends React.PureComponent<ITeamSelectorProps, ITeamSelectorState> {
    constructor(props: ITeamSelectorProps) {
        super(props);

        this.state = {
            teams: []
        };
    }

    async componentDidMount() {
        const teams: ITeamReference[] = [
            {
                name: "Team Blue",
                id: "teamblue"
            },
            {
                name: "Team Red",
                id: "teamread"
            }
        ];
        this.setState({
            teams
        });
    }

    render(): JSX.Element {
        const { input, value } = this.props;
        const { teams } = this.state;

        return (
            <Dropdown
                onChanged={this.onChanged}
                label={input.label || "Select team"}
                selectedKey={value}
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