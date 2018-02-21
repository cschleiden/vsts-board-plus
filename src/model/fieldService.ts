import { IFieldReference } from "./interfaces";

export class FieldService {
    public getFields(): Promise<IFieldReference[]> {
        return Promise.resolve([
            {
                referenceName: "System.State",
                displayName: "State"
            },
            {
                referenceName: "System.Title",
                displayName: "Title"
            },
            {
                referenceName: "System.AreaPath",
                displayName: "Area Path"
            },
            {
                referenceName: "System.IterationPath",
                displayName: "Iteration"
            },
            {
                referenceName: "System.AssignedTo",
                displayName: "Assigned To"
            },
            {
                referenceName: "System.Tags",
                displayName: "Tags"
            }
        ]);
    }
}