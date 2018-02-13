import board, { IBoardState } from "./board";
import { combineReducers } from "redux";

export interface IState {
    board: IBoardState;
}

export default combineReducers({
    board
});