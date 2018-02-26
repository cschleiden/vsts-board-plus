import { makeAction } from "./actions";
import { IBoardConfiguration } from "../model/interfaces";

export const init = makeAction<IBoardConfiguration[]>("directory-init");