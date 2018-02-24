import * as React from "react";
import { TemplateInputTypes } from "../../../model/configuration/inputs";
import { FieldSelector } from "./fieldSelector";
import { IPartitionProviderTemplateInput, IPartitionProviderInputs } from "../../../model/interfaces";
import { GroupInput } from "./group";
import { TextInput } from "./textInput";
import { autobind } from "@uifabric/utilities";
import { TeamSelector } from "./teamSelector";

export interface InputComponentProps {
    input: IPartitionProviderTemplateInput;

    // tslint:disable-next-line:no-any
    value: any;

    onUpdate(inputs: IPartitionProviderInputs): void;
}

export class InputComponent extends React.PureComponent<InputComponentProps> {
    render(): JSX.Element {
        const { input, value: inputValue } = this.props;

        let value = inputValue;
        if (value && input.inputKey) {
            value = inputValue[input.inputKey];
        }

        switch (input.type) {
            case TemplateInputTypes.Field:
                return <FieldSelector input={input} value={value} onChanged={this.onInputChanged} />;

            case TemplateInputTypes.Team:
                return <TeamSelector input={input} value={value} onChanged={this.onInputChanged} />;

            case TemplateInputTypes.Group:
                return (
                    <GroupInput
                        input={input}
                        value={value}
                        onRenderInput={this.renderInput}
                        onChanged={this.onInputChanged}
                    />
                );

            case TemplateInputTypes.TextInput:
                return <TextInput input={input} value={value} onChanged={this.onInputChanged} />;

            default:
                return <div>"Error"</div>;
        }
    }

    // tslint:disable-next-line:no-any
    private renderInput(key: string, input: IPartitionProviderTemplateInput, value: any, onUpdate: (value: any) => void): JSX.Element {
        return (
            <InputComponent key={key} input={input} value={value} onUpdate={onUpdate} />
        );
    }

    @autobind
    // tslint:disable-next-line:no-any
    private onInputChanged(value: any) {
        const { input, onUpdate, value: inputValue } = this.props;

        if (input.inputKey) {
            const updatedValue = {
                ...inputValue,
                [input.inputKey]: value
            };

            onUpdate(updatedValue);
        } else {
            onUpdate(value);
        }
    }
}