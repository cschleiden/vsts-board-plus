import { IDataSource, DataSourceType } from "../interfaces";
import { WitService } from "../../services/witService";

export class QueryDataSource implements IDataSource {
    public readonly type: DataSourceType = DataSourceType.Query;

    constructor(public readonly queryId: string) { }

    getItems(): Promise<number[]> {
        const witService = new WitService();

        return witService.runQuery(this.queryId);
    }
}