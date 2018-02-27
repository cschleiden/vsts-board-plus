import { init } from "./directory.actions";
import { asyncActionCreator } from "./actions";
import { BoardService } from "../model/boardService";
import { switchView } from "./nav.actions";
import { createBoard } from "./board.actionsCreator";

export const initDirectory = () => asyncActionCreator(async (dispatch) => {
    const boardService = new BoardService();

    const boards = await boardService.getBoards();
    return dispatch(init(boards));
});

export const newBoard = () => asyncActionCreator(async (dispatch) => {
    dispatch(switchView("board"));

    return dispatch(createBoard());
});