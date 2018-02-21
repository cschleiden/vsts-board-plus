import { combineReducers } from "redux";
import board, { IBoardState } from "./board.reducer";
import nav, { INavState } from "./nav.reducer";
import configuration, { IConfigurationState } from "./configuration.reducer";

export interface IState {
    board: IBoardState;
    nav: INavState;
    configuration: IConfigurationState;
}

export default combineReducers({
    board,
    nav,
    configuration
});