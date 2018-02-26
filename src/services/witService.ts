import { getClient, WorkItemTrackingHttpClient4 } from "TFS/WorkItemTracking/RestClient";
import { WorkItem } from "TFS/WorkItemTracking/Contracts";

export interface IWitService {

}

export class WitService implements IWitService {
    pageFields(ids: number[], fieldReferenceNames: string[]): Promise<WorkItem[]> {
        // tslint:disable-next-line:no-console
        console.log("Paging for ", ids, fieldReferenceNames);

        return this.getClient().getWorkItems(
            ids,
            fieldReferenceNames
        ) as Promise<WorkItem[]>;
    }

    runQuery(queryId: string): Promise<number[]> {
        return this.getClient().queryById(queryId)
            .then(result => result.workItems.map(wi => wi.id)) as Promise<number[]>;
    }

    private getClient(): WorkItemTrackingHttpClient4 {
        return getClient();
    }
}