export interface IWitService {

}

export class WitService implements IWitService {
    pageFields(ids: number[], fieldReferenceNames: string[]): Promise<(string | number)[][]> {
        // tslint:disable-next-line:no-console
        console.log("Paging for ", ids, fieldReferenceNames);

        return Promise.resolve([]);
    }

    runQuery(queryId: string): Promise<number[]> {
        return Promise.resolve([]);
    }
}