import { init } from "./directory.actions";
import { asyncActionCreator } from "./actions";
import { BoardService } from "../model/boardService";

export const initDirectory = () => asyncActionCreator(async (dispatch) => {
    const boardService = new BoardService();

    const boards = await boardService.getBoards();
    return dispatch(init(boards));
});