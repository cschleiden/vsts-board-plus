import { IDropLocation, IFieldValueMap } from "../model/interfaces";
import { init, updateItem } from "./board.actions";
import getPartitionProvider from "../model/partitionProviders";
import { asyncActionCreator } from "./actions";
import { BoardService } from "../model/boardService";

export const initBoard = (boardId: string) => asyncActionCreator(async (dispatch) => {
    const boardService = new BoardService();

    const config = await boardService.getBoardConfigurationById(boardId);
    const items = await boardService.getItemsForBoard(config);

    const verticalPartitions = await Promise.all(
        config.verticalPartitionProviders.map(hp => getPartitionProvider(hp.type).getPartitions(hp, items)));
    const horizontalPartitions = await Promise.all(
        config.horizontalPartitionProviders.map(hp => getPartitionProvider(hp.type).getPartitions(hp, items)));

    return dispatch(init({
        config,
        items,
        verticalPartitions,
        horizontalPartitions
    }));
});

export const createBoard = () => asyncActionCreator(async (dispatch) => {
    const boardService = new BoardService();
    const emptyConfig = await boardService.createBoard();

    return dispatch(init({
        config: emptyConfig,
        items: [],
        verticalPartitions: [],
        horizontalPartitions: []
    }))
});

export const dropCard = (id: number, location: IDropLocation) => asyncActionCreator(async (dispatch) => {
    const fieldChanges: IFieldValueMap = {};

    for (const partition of location.partitions) {
        fieldChanges[partition.fieldName] = partition.value;
    }

    return dispatch(updateItem({ id, fieldChanges }));
});