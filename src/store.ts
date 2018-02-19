import { createStore } from "redux";
import reducer from "./reducers";
import thunk from "redux-thunk";
import { applyMiddleware } from "redux";
import { compose } from "redux";

const store = createStore(
    reducer,
    compose(
        applyMiddleware(thunk),
        // tslint:disable-next-line:no-any
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
);
export default store;