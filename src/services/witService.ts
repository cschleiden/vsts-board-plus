import { getClient, WorkItemTrackingHttpClient4 } from "TFS/WorkItemTracking/RestClient";
import { WorkItem, WorkItemQueryResult, WorkItemExpand } from "TFS/WorkItemTracking/Contracts";
import { JsonPatchDocument, JsonPatchOperation, Operation } from "VSS/WebApi/Contracts";

const ParentLinkName = "System.LinkTypes.Hierarchy-Reverse";

export interface IWitService {
}

export class WitService implements IWitService {
    runQueryText(query: string): Promise<WorkItemQueryResult> {
        return this.getClient().queryByWiql({
            query
        }) as Promise<WorkItemQueryResult>;
    }

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
            .then(result => {
                if (result.workItemRelations) {
                    return result.workItemRelations.map(x => x.target.id);
                } else {
                    result.workItems.map(wi => wi.id);
                }
            }) as Promise<number[]>;
    }

    async updateWorkItem(id: number, changedFields: { [fieldName: string]: any }): Promise<void> {
        const changedFieldNames = Object.keys(changedFields);

        await this.getClient().updateWorkItem(changedFieldNames
            .filter(fieldName => changedFields[fieldName] != null)
            .map(fieldName => ({
                "op": "add",
                "path": `/fields/${fieldName}`,
                "value": changedFields[fieldName]
            })), id);
    }

    async updateParent(id: number, newParentId: number): Promise<void> {
        const webContext = VSS.getWebContext();

        const client = this.getClient();

        const workItem = await client.getWorkItem(id, undefined, undefined, WorkItemExpand.Relations);

        const operations: JsonPatchOperation[] = [{
            "from": undefined,
            "op": Operation.Test,
            "path": "/rev",
            "value": workItem.rev
        }];

        const existingParentIndex = workItem.relations && workItem.relations.findIndex(r => r.rel.toLowerCase() === ParentLinkName.toLowerCase());
        if (existingParentIndex >= 0) {
            // Remove link
            operations.push({
                "from": undefined,
                "op": Operation.Remove,
                "path": `/relations/${existingParentIndex}`,
                "value": undefined
            });
        }

        if (newParentId > 0) {
            // Add link
            operations.push({
                "from": undefined,
                "op": Operation.Add,
                "path": "/relations/-",
                "value": {
                    "rel": ParentLinkName,
                    "url": `${webContext.account.uri}/${webContext.collection.id}/_apis/wit/workItems/${newParentId}`
                }
            });
        }

        await this.getClient().updateWorkItem(operations, id);
    }

    private getClient(): WorkItemTrackingHttpClient4 {
        return getClient();
    }
}