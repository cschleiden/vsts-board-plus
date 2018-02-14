import { createStore } from "redux";
import reducer from "./reducers";

const store = createStore(
    reducer,
    // tslint:disable-next-line:no-any
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());
export default store;