import { IAction, IActionC } from "../actions/actions";

// tslint:disable-next-line:no-any
export function reducerMap<TState>(initialState: TState, actions: ([IActionC<any>, (state: TState, payload: any) => TState])[]) {
    const map = {};
    for (const [action, handler] of actions) {
        map[action.TYPE] = handler;
    }

    return <TPayload>(state: TState = initialState, action: IAction<TPayload>): TState => {
        if (map[action.type]) {
            return map[action.type](state, action.payload);
        }

        return state;
    };
}