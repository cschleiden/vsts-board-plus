import * as React from "react";
import { TemplateInputTypes } from "../../../model/configuration/inputs";
import { FieldSelector } from "./fieldSelector";
import { IPartitionProviderTemplateInput } from "../../../model/interfaces";
import { GroupInput } from "./group";
import { TextInput } from "./textInput";
import { autobind } from "@uifabric/utilities";

export interface InputComponentProps {
    input: IPartitionProviderTemplateInput;
}

export class InputComponent extends React.PureComponent<InputComponentProps> {
    render(): JSX.Element {
        const { input } = this.props;
        switch (input.type) {
            case TemplateInputTypes.FieldReferenceName:
                return <FieldSelector input={input} onChanged={this.onInputChanged} />;

            case TemplateInputTypes.Group:
                return <GroupInput input={input} onRenderInput={this.renderInput} />;

            case TemplateInputTypes.TextInput:
                return <TextInput input={input} />;

            default:
                return <div>"Error"</div>;
        }
    }

    private renderInput(input: IPartitionProviderTemplateInput, key: string): JSX.Element {
        return (
            <InputComponent key={key} input={input} />
        );
    }

    @autobind
    private onInputChanged() {
        // tslint:disable-next-line:no-console
        console.log("change");
    }
}