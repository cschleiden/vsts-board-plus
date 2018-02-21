import * as React from "react";
import { IPartitionProviderTemplateInput } from "../../../model/interfaces";
import { TextField } from "office-ui-fabric-react/lib/TextField";

export interface IFieldSelectorProps {
    input: IPartitionProviderTemplateInput;
}

export class TextInput extends React.PureComponent<IFieldSelectorProps> {
    render(): JSX.Element {
        const { input } = this.props;
        return (
            <TextField label={input.label} />
        );
    }
}