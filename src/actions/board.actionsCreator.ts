import { IDropLocation, IFieldValueMap } from "../model/interfaces";
import { init, updateItem, updateItemStatus } from "./board.actions";
import getPartitionProvider from "../model/partitionProviders";
import { asyncActionCreator } from "./actions";
import { BoardService } from "../model/boardService";
import { WitService } from "../services/witService";
import { toArray } from "../utils/map";

export const initBoard = (boardId: string) => asyncActionCreator(async (dispatch) => {
    const boardService = new BoardService();

    const config = await boardService.getBoardConfigurationById(boardId);
    const items = await boardService.getItemsForBoard(config);

    const itemArray = toArray(items);

    const verticalPartitions = await Promise.all(
        config.verticalPartitionProviders.map(hp => getPartitionProvider(hp.type).getPartitions(hp, itemArray)));
    const horizontalPartitions = await Promise.all(
        config.horizontalPartitionProviders.map(hp => getPartitionProvider(hp.type).getPartitions(hp, itemArray)));

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

export const dropCard = (id: number, location: IDropLocation, index: number) => asyncActionCreator(async (dispatch, getState) => {
    const state = getState();
    const { board } = state;
    const { config } = board;

    const fieldChanges: IFieldValueMap = {};

    for (const partition of location.partitions) {
        fieldChanges[partition.fieldName] = partition.value;
    }

    // Dispatch UI change immediately
    dispatch(updateItem({ id, fieldChanges, index, inProgress: true }));

    try {
        // Update item
        const providers = [...config.verticalPartitionProviders, ...config.horizontalPartitionProviders].map(pp => ({ provider: getPartitionProvider(pp.type), config: pp }));

        for (const { provider, config } of providers) {
            const result = provider.updateItem(config, id, fieldChanges);
            if (isPromise(result)) {
                await result;
            }
        }

        // Execute final field changes
        if (Object.keys(fieldChanges).length > 0) {
            const witService = new WitService();
            await witService.updateWorkItem(id, fieldChanges);
        }

        return dispatch(updateItemStatus({ id, inProgress: false }));
    } catch (error) {
        // TODO: Handle errors...
        return dispatch(updateItemStatus({
            id,
            inProgress: true,
            message: error && error.serverError && error.serverError.message
        }));
    }
});

function isPromise<T>(value: Promise<T> | T): value is Promise<T> {
    return value && !!value["then"];
}