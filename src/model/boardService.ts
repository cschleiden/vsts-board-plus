import { ExtensionDataService } from "VSS/SDK/Services/ExtensionData";
import { IBoardConfiguration, IItem, PartitionProviderType, IFieldReference, DataSourceType } from "./interfaces";
import { FieldReferenceNames } from "./constants";
import { IStaticPartitionProviderInputs } from "./partitionProviders/static";
import getPartitionProvider from "./partitionProviders";
import { WitService } from "../services/witService";
import { generateUuidv4 } from "../utils/guid";

const RequiredFields: string[] = [
    FieldReferenceNames.Id,
    FieldReferenceNames.Title,
    FieldReferenceNames.WorkItemType,
    FieldReferenceNames.TeamProject
];

const CollectionName = "boards";

export class BoardService {
    async createBoard(): Promise<IBoardConfiguration> {
        return {
            id: generateUuidv4(),
            name: "New Board",
            dataSource: DataSourceType.Query,
            queryId: "",
            horizontalPartitionProviders: [],
            verticalPartitionProviders: []
        };
    }

    async getBoards(): Promise<IBoardConfiguration[]> {
        return this.getService().then((service: ExtensionDataService) => {
            return service.getDocuments(CollectionName);
        });
    }

    async getBoardConfigurationById(id: string): Promise<IBoardConfiguration> {
        return this.getService().then(service => {
            return service.getDocument(CollectionName, id);
        });
    }

    async saveBoardConfiguration(config: IBoardConfiguration): Promise<void> {
        return this.getService().then(service => {
            return service.setDocument(CollectionName, config);
        });
    }

    async getRequiredFields(config: IBoardConfiguration): Promise<string[]> {
        const partitionProviders = [
            ...config.horizontalPartitionProviders,
            ...config.verticalPartitionProviders
        ];

        const result = await Promise.all(partitionProviders.map(p => {
            const provider = getPartitionProvider(p.type);

            return provider.getRequiredFields(p);
        }));

        return result.reduce((r, c) => r.concat(c), []);
    }

    async getItemsForBoard(config: IBoardConfiguration): Promise<{ [id: number]: IItem }> {
        const requiredFieldReferenceNames = await this.getRequiredFields(config);
        const pageFields = RequiredFields.concat(requiredFieldReferenceNames);

        const queryId = config.queryId;

        const witService = new WitService();
        const workItemIds = await witService.runQuery(queryId);
        const workItems = await witService.pageFields(workItemIds, pageFields);

        const workItemMap: { [id: number]: IItem } = {};
        workItems.forEach(workItem => {
            workItemMap[workItem.id] = {
                id: workItem.id,
                values: workItem.fields
            };
        });
        return workItemMap;
    }

    private getService(): Promise<ExtensionDataService> {
        return VSS.getService(VSS.ServiceIds.ExtensionData) as Promise<ExtensionDataService>;
    }
}