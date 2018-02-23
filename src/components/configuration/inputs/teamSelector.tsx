import * as React from "react";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { FieldService } from "../../../model/fieldService";
import { IFieldReference, IPartitionProviderTemplateInput } from "../../../model/interfaces";
import { ISelectableOption } from "office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.types";
import { autobind } from "@uifabric/utilities";

export interface ITeamSelectorProps {
    input: IPartitionProviderTemplateInput;

    onChanged(): void;
}

export interface ITeamSelectorState {
    fields: IFieldReference[];
}

interface ITeamSelectorOption extends ISelectableOption, IFieldReference {
}

export class TeamSelector extends React.PureComponent<ITeamSelectorProps, ITeamSelectorState> {
    fieldService: FieldService;

    constructor(props: ITeamSelectorProps) {
        super(props);

        this.state = {
            fields: []
        };
    }

    async componentDidMount() {
        this.fieldService = new FieldService();

        const fields = await this.fieldService.getFields();
        this.setState({
            fields
        });
    }

    render(): JSX.Element {
        const { input } = this.props;
        const { fields } = this.state;

        return (
            <Dropdown
                onChanged={this.onChanged}
                label={input.label || "Select team"}
                options={fields.map(f => ({
                    ...f,
                    key: f.referenceName,
                    text: f.displayName
                } as ITeamSelectorOption))}
            />
        );
    }

    @autobind
    private onChanged(option: ITeamSelectorOption) {
        const { onChanged } = this.props;
        if (onChanged) {
            onChanged();
        }
    }
}