import * as React from "react";
import { connect } from "react-redux";
import Directory from "./directory";
import Board from "./board";
import { IState } from "../reducers";

interface IMainProps {
    view: string;
}

class Main extends React.Component<IMainProps> {
    render(): JSX.Element {
        const { view } = this.props;

        switch (view) {
            default:
            case "directory":
                return (
                    <Directory />
                );

            case "board":
                return (
                    <Board />
                );
        }
    }
}

export default connect((state: IState) => {
    const { view } = state.nav;

    return {
        view
    };
})(Main);
