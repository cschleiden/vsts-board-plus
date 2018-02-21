import "./group.css";
import * as React from "react";
import { IPartitionProviderTemplateInput } from "../../../model/interfaces";
import { IconButton } from "office-ui-fabric-react/lib/Button";

export interface GroupInputProps {
    input: IPartitionProviderTemplateInput;

    onRenderInput(input: IPartitionProviderTemplateInput, key: string): JSX.Element;
}

export class GroupInput extends React.PureComponent<GroupInputProps> {
    render(): JSX.Element {
        const { input, onRenderInput } = this.props;

        return (
            <div className="group-input">
                <div className="group-input--header">
                    <div className="group-input--label">
                        {input.label}
                    </div>
                    <div className="group-input--actions">
                        <IconButton iconProps={{ iconName: "Add" }} />
                    </div>
                </div>
                <div className="group-input--inputs">
                    {input.group.map((i, index) => onRenderInput(i, index.toString()))}
                </div>
            </div>
        );
    }
}