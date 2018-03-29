import "./queryPicker.scss";
import * as React from "react";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { QueryHierarchyItem, QueryExpand } from "TFS/WorkItemTracking/Contracts";
import { getClient } from "TFS/WorkItemTracking/RestClient";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { ISelectableOption } from "office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.types";
import { IconButton } from "office-ui-fabric-react/lib/Button";

interface IQueryOption extends ISelectableOption {
    hasChildren: boolean;
    isExpanded: boolean;
    level: number;

    queryTreeItem: IQueryTreeItem;
}

interface IQueryTreeItem {
    parentId: string;
    item: QueryHierarchyItem;

    childrenFetched: boolean;
    isExpanded: boolean;
}

export interface IQueryPickerProps {
    defaultSelectedQueryId?: string;

    onChanged?(queryId: string);
}

export interface IQueryPickerState {
    options: IQueryOption[];

    isLoading: boolean;
}

export class QueryPicker extends React.Component<IQueryPickerProps, IQueryPickerState> {
    private queryTree: IQueryTreeItem[] = [];
    private queryTreeLookup: { [key: string]: IQueryTreeItem } = {};

    constructor(props: IQueryPickerProps) {
        super(props);

        this.state = {
            options: [],
            isLoading: true
        };
    }

    componentDidMount() {
        const { defaultSelectedQueryId } = this.props;

        const webContext = VSS.getWebContext();
        getClient().getQueries(webContext.project.id, QueryExpand.Minimal, 0).then(async queryItems => {
            this._mapQueryItems(queryItems);

            if (defaultSelectedQueryId) {
                await this.setInitial(defaultSelectedQueryId);
            }

            this._updateState();

            this.setState({
                isLoading: false
            })
        });
    }

    private async setInitial(id: string): Promise<void> {
        const client = getClient();

        // If selected query id is given, build up tree
        const webContext = VSS.getWebContext();
        const queryItem = await client.getQuery(webContext.project.id, id, QueryExpand.Minimal, 0);

        // Retrieve parent elements
        const path = queryItem.path;
        const pathSegments = path.split("/");
        // Remove own element since it's not a folder
        pathSegments.pop();

        let parent: IQueryTreeItem = null;
        for (let i = 0; i < pathSegments.length; ++i) {
            let parentQueryItem = await client.getQuery(webContext.project.id, pathSegments.slice(0, i + 1).join("/"), QueryExpand.Minimal, 1);

            if (this.queryTreeLookup[parentQueryItem.id]) {
                parent = this.queryTreeLookup[parentQueryItem.id];
            } else {
                parent = this._mapQueryItem(parent && parent.item.id, parentQueryItem);
            }

            for (const childItem of parentQueryItem.children) {
                this._mapQueryItem(parentQueryItem.id as string, childItem);
            }

            parent.isExpanded = true;
            parent.childrenFetched = true;
        }
    }


    render(): JSX.Element {
        const { defaultSelectedQueryId } = this.props;
        const { isLoading, options } = this.state;

        return (
            <Dropdown
                label={"Select query"}
                placeHolder={isLoading ? "Loading..." : "Select query"}
                options={options}
                onRenderItem={this._onRenderItem}
                onRenderOption={this._onRenderOption}
                onChanged={this._onChanged}
                disabled={isLoading}
                selectedKey={!isLoading && defaultSelectedQueryId}
            />
        );
    }

    @autobind
    private _onChanged(option: IQueryOption) {
        const { onChanged } = this.props;
        if (onChanged) {
            onChanged(option.queryTreeItem.item.id);
        }
    }

    private _buildOptions(): IQueryOption[] {
        const result: IQueryOption[] = [];

        const stack: IQueryTreeItem[] = [];
        let level = 0;

        stack.push(...this.queryTree.slice(0).reverse());
        while (stack.length > 0) {
            const l = stack.length;
            for (let i = 0; i < l; ++i) {
                const treeItem = stack.pop();

                let level = 0;
                let parentId = treeItem.parentId;
                while (parentId) {
                    ++level;
                    parentId = this.queryTreeLookup[parentId].parentId;
                }

                result.push({
                    key: treeItem.item.id,
                    text: treeItem.item.name,
                    hasChildren: treeItem.item.hasChildren,
                    isExpanded: treeItem.isExpanded,
                    level,
                    queryTreeItem: treeItem
                });

                if (treeItem.item.hasChildren && treeItem.isExpanded) {
                    if (treeItem.childrenFetched) {
                        stack.push(...treeItem.item.children.map(c => this.queryTreeLookup[c.id]).reverse());
                    } else {
                        // Add dummy loading item if loading children
                        result.push({
                            key: treeItem.item.id + "-loading",
                            text: "Loading...",
                            hasChildren: false,
                            isExpanded: false,
                            level,
                            queryTreeItem: treeItem
                        });
                    }
                }
            }
        }

        return result;
    }

    @autobind
    private _onRenderItem(item: IQueryOption, defaultRender): JSX.Element {
        if (item && item.key && this.queryTreeLookup[item.key] && this.queryTreeLookup[item.key].item.hasChildren) {
            return this._onRenderOption(item);
        }

        return defaultRender(item);
    }

    @autobind
    private _onRenderOption(option: IQueryOption): JSX.Element {
        const marginLeft = option.level * 10;

        return (
            <div className="query-item">
                {option.hasChildren && <IconButton
                    style={{ marginLeft }}
                    onClick={(ev) => this._toggle(ev, option)}
                    iconProps={{ iconName: option.isExpanded ? "ChevronDown" : "ChevronRight" }}
                />}
                {!option.hasChildren && <div className="query-item--spacer" style={{ marginLeft }} />}
                <div>{option.text}</div>
            </div>
        )
    }

    private _mapQueryItems(queryItems: QueryHierarchyItem[]) {
        for (const queryItem of queryItems) {
            this.queryTree.push(this._mapQueryItem(null, queryItem));
        }
    }

    private _mapQueryItem(parentId: string, queryItem: QueryHierarchyItem): IQueryTreeItem {
        let parentItem: IQueryTreeItem = null;
        if (parentId) {
            parentItem = this.queryTreeLookup[parentId];
        }

        const treeItem: IQueryTreeItem = {
            parentId,
            item: queryItem,
            childrenFetched: false,
            isExpanded: false
        };

        if (parentItem) {
            if (!parentItem.item.children) {
                parentItem.item.children = [];
            }

            if (!parentItem.item.children.some(i => i.id === queryItem.id)) {
                parentItem.item.children.push(queryItem);
            }
        }

        this.queryTreeLookup[queryItem.id] = treeItem;

        return treeItem;
    }

    @autobind
    private _toggle(ev: React.MouseEvent<any>, option: IQueryOption) {
        const queryTreeItem = this.queryTreeLookup[option.key];
        queryTreeItem.isExpanded = !queryTreeItem.isExpanded;

        if (!queryTreeItem.childrenFetched) {
            getClient().getQuery(VSS.getWebContext().project.id, option.key as string, QueryExpand.Minimal, 1).then(queryItem => {
                // Add in items
                queryTreeItem.childrenFetched = true;

                for (const childItem of queryItem.children) {
                    this._mapQueryItem(option.key as string, childItem);
                }

                this._updateState();
            });
        }

        this._updateState();

        ev.preventDefault();
        ev.stopPropagation();
    }

    private _updateState() {
        // Re-build options
        this.setState({
            options: this._buildOptions()
        });
    }
}