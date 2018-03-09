import { IFieldReference } from "./interfaces";
import { getClient } from "TFS/WorkItemTracking/RestClient";
import { GetFieldsExpand } from "TFS/WorkItemTracking/Contracts";

export class FieldService {
    public getFields(): Promise<IFieldReference[]> {
        const webContext = VSS.getWebContext();
        return getClient().getFields(webContext.project.id)
            .then(fields => fields.map(field => ({
                referenceName: field.referenceName,
                displayName: field.name
            }))) as Promise<IFieldReference[]>;

        // return Promise.resolve([
        //     {
        //         referenceName: "System.State",
        //         displayName: "State"
        //     },
        //     {
        //         referenceName: "System.Title",
        //         displayName: "Title"
        //     },
        //     {
        //         referenceName: "System.AreaPath",
        //         displayName: "Area Path"
        //     },
        //     {
        //         referenceName: "System.IterationPath",
        //         displayName: "Iteration"
        //     },
        //     {
        //         referenceName: "System.AssignedTo",
        //         displayName: "Assigned To"
        //     },
        //     {
        //         referenceName: "System.Tags",
        //         displayName: "Tags"
        //     },
        //     {
        //         referenceName: "System.",
        //         displayName: "Tags"
        //     }
        // ]);
    }
}