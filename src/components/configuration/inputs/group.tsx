import "./group.css";
import * as React from "react";
import { IPartitionProviderTemplateInput } from "../../../model/interfaces";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { autobind } from "office-ui-fabric-react/lib/Utilities";

export interface GroupInputProps {
    input: IPartitionProviderTemplateInput;

    // tslint:disable-next-line:no-any
    value: any[];

    // tslint:disable-next-line:no-any
    onRenderInput(key: string, input: IPartitionProviderTemplateInput, value: any, onChanged: (value: any) => void): JSX.Element;

    // onAdd(): void;
    // onRemove(index: number): void;

    // tslint:disable-next-line:no-any
    onChanged(value: any): void;
}

export class GroupInput extends React.PureComponent<GroupInputProps> {
    render(): JSX.Element {
        const { input, onRenderInput, value } = this.props;

        return (
            <div className="group-input">
                <div className="group-input--header">
                    <div className="group-input--label">
                        {input.label}
                    </div>
                    <div className="group-input--actions">
                        <IconButton
                            iconProps={{ iconName: "Add" }}
                            title="Add new element"
                            onClick={this.onAdd}
                        />
                        <IconButton
                            iconProps={{ iconName: "Delete" }}
                            title="Remove last element"
                            onClick={this.onRemove}
                        />
                    </div>
                </div>
                <div className="group-input--inputs">
                    {value && value.map((v, valueIndex) =>
                        <div className="group-input--group-input-wrapper" key={valueIndex}>
                            <div className="group-input--group-input">
                                {
                                    input.group.map((groupInput, inputIndex) =>
                                        onRenderInput(inputIndex.toString(), groupInput, v, this.onChanged.bind(this, valueIndex)))
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    @autobind
    private onAdd() {
        const { onChanged, value } = this.props;

        let newValue = (value || []).slice(0);
        newValue.push(null);

        onChanged(newValue);
    }

    @autobind
    private onRemove() {
        const { onChanged, value } = this.props;

        let newValue = value || [];
        if (newValue.length > 0) {
            onChanged(newValue.slice(0, newValue.length - 1));
        }
    }

    @autobind
    // tslint:disable-next-line:no-any
    private onChanged(index: number, newValue: any) {
        const { onChanged, value } = this.props;

        const clone = value.slice(0);
        clone[index] = newValue;
        onChanged(clone);
    }
}