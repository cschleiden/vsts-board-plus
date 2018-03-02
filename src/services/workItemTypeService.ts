import { getClient, WorkItemTrackingHttpClient4 } from "TFS/WorkItemTracking/RestClient";
import { WorkItemIcon } from "TFS/WorkItemTracking/Contracts";

export interface WorkItemTypeColorIcon {
    color: string;
    icon: WorkItemIcon;
}

const cache: { [project: string]: { [typeName: string]: Promise<WorkItemTypeColorIcon> } } = {};

export class WorkItemTypeService {
    getWorkItemTypeIcon(project: string, typeName: string): Promise<WorkItemTypeColorIcon> {
        if (cache[project]) {
            if (cache[project][typeName]) {
                return cache[project][typeName];
            }
        }

        if (!cache[project]) {
            cache[project] = {};
        }

        cache[project][typeName] = this.getClient().getWorkItemType(project, typeName).then(workItemType => ({
            color: workItemType.color,
            icon: workItemType.icon
        })) as Promise<WorkItemTypeColorIcon>;

        return cache[project][typeName];
    }

    private getClient(): WorkItemTrackingHttpClient4 {
        return getClient();
    }
}