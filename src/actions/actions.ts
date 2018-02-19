import { Action as ReduxAction } from "redux";
import { IState } from "../reducers";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

export interface IAction<T> extends ReduxAction {
    payload: T;
}

export interface IActionC<TPayload> {
    TYPE: string;
    payload: TPayload;

    (payload: TPayload): IAction<TPayload>;
}

export function makeAction<TPayload>(type: string): IActionC<TPayload> {
    const ac: IActionC<TPayload> = ((payload: TPayload) => ({
        type,
        payload
    })) as IActionC<TPayload>;

    ac.TYPE = type;
    ac.payload = {} as TPayload;

    return ac;
}

export function asyncActionCreator<TResult>(
    _: (dispatch: Dispatch<IState>, getState: () => IState) => Promise<TResult>): ThunkAction<Promise<TResult>, IState, void> {

    return (dispatch: Dispatch<IState>, getState: () => IState) => _(dispatch, getState);
}