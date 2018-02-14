import { IPartitionDrop } from "../components/board";
import { IAction } from "./actions";

export const boardDrop = (id: number, drop: IPartitionDrop): IAction<{ id: number; drop: IPartitionDrop }> => ({
    type: "board-drop",
    payload: {
        id,
        drop
    }
});