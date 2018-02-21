import * as React from "react";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { FieldService } from "../../../model/fieldService";
import { IFieldReference, IPartitionProviderTemplateInput } from "../../../model/interfaces";
import { ISelectableOption } from "office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.types";
import { autobind } from "@uifabric/utilities";

export interface IFieldSelectorProps {
    input: IPartitionProviderTemplateInput;

    onChanged(): void;
}

export interface IFieldSelectorState {
    fields: IFieldReference[];
}

interface IFieldSelectorOption extends ISelectableOption, IFieldReference {
}

export class FieldSelector extends React.PureComponent<IFieldSelectorProps, IFieldSelectorState> {
    fieldService: FieldService;

    constructor(props: IFieldSelectorProps) {
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
                label={input.label || "Select field"}
                options={fields.map(f => ({
                    ...f,
                    key: f.referenceName,
                    text: f.displayName
                } as IFieldSelectorOption))}
            />
        );
    }

    @autobind
    private onChanged(option: IFieldSelectorOption) {
        const { onChanged } = this.props;
        if (onChanged) {
            onChanged();
        }
    }
}