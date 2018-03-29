import * as React from "react";
import { WorkItemTypeColorIcon } from "../services/workItemTypeService";
import "./typeIcon.scss";

export interface ITypeIconProps {
    icon: WorkItemTypeColorIcon;
}

export class TypeIcon extends React.PureComponent<ITypeIconProps> {
    render() {
        const { icon } = this.props;

        return icon.icon && (
            <img className="work-item-type-icon" src={icon.icon.url} />
        );
    }
};