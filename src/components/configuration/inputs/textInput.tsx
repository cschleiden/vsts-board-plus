import * as React from "react";
import { IPartitionProviderTemplateInput } from "../../../model/interfaces";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { autobind } from "office-ui-fabric-react/lib/Utilities";

export interface IFieldSelectorProps {
    input: IPartitionProviderTemplateInput;

    value: string;

    onChanged(value: string): void;
}

export class TextInput extends React.PureComponent<IFieldSelectorProps> {
    render(): JSX.Element {
        const { input, value } = this.props;

        return (
            <TextField label={input.label} value={value} onChanged={this.onChanged} />
        );
    }

    @autobind
    private onChanged(value: string) {
        const { onChanged } = this.props;
        onChanged(value);
    }
}