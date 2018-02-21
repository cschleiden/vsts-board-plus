import "./default.css";
import * as React from "react";
import { css } from "../../utils/css";

export interface IDefaultLegendProps {
    label: string;

    vertical?: boolean;
}

export class DefaultLegend extends React.PureComponent<IDefaultLegendProps> {
    public render(): JSX.Element {
        const { label, vertical } = this.props;

        return (
            <div
                className={css(
                    "legend-default",
                    vertical && "legend-default--vertical"
                )}
            >
                {label}
            </div>
        );
    }
}