import { isGuid } from "./guid";

//
// Copyright Mohit Bagra - https://github.com/mohitbagra/vsts-extensions/blob/master/src/Library/Utilities/Identity.ts
//

function isNullOrWhiteSpace(str: string): boolean {
    return str == null || str.trim() === "";
}

export interface IdentityRef {
    id: string;
    displayName: string;
    uniqueName: string;
    descriptor?: string;
    imageUrl?: string;
}

export function parseWorkItemIdentityName(distinctName: string): IdentityRef {
    if ((distinctName || "").trim() === "") {
        return {
            id: null,
            displayName: null,
            uniqueName: null,
            imageUrl: null
        };
    }

    const i = distinctName.lastIndexOf("<");
    const j = distinctName.lastIndexOf(">");
    let displayName = distinctName;
    let uniqueName: string;
    let rightPart: string;
    let id: string;

    if (i >= 0 && j > i && j === distinctName.length - 1) {
        displayName = distinctName.substr(0, i).trim();
        rightPart = distinctName.substr(i + 1, j - i - 1).trim();
        const vsIdFromAlias: string = getVsIdFromGroupUniqueName(rightPart); // if it has vsid in unique name (for TFS groups)
        if (rightPart.indexOf("@") !== -1 || rightPart.indexOf("\\") !== -1 || vsIdFromAlias || isGuid(rightPart)) {
            // if its a valid alias
            uniqueName = rightPart;

            // If the alias component is just a guid then this is not a uniqueName but
            // vsId which is used only for TFS groups
            if (vsIdFromAlias !== "") {
                id = vsIdFromAlias;
                uniqueName = null;
            }
        }
        else {
            // if its not a valid alias, treat it as a non-identity string
            displayName = distinctName;
        }
    }

    return {
        id: id,
        displayName: displayName,
        uniqueName: uniqueName,
        imageUrl: getIdentityImageUrl(id, uniqueName)
    };
}

export function getIdentityImageUrl(id: string, uniqueName?: string): string {
    if (!isNullOrWhiteSpace(id)) {
        return `${VSS.getWebContext().host.uri}/_api/_common/IdentityImage?id=${id}`;
    }
    else if (!isNullOrWhiteSpace(uniqueName)) {
        return `${VSS.getWebContext().host.uri}/_api/_common/IdentityImage?identifier=${uniqueName}&identifierType=0`;
    }

    return null;
}

export function parseUniquefiedIdentityName(distinctName: string): IdentityRef {
    if (isNullOrWhiteSpace(distinctName)) {
        return {
            id: null,
            displayName: null,
            uniqueName: null,
            imageUrl: null
        };
    }

    const i = distinctName.lastIndexOf("<");
    const j = distinctName.lastIndexOf(">");
    let displayName = distinctName;
    let uniqueName: string;
    let id: string;

    if (i >= 0 && j > i && j === distinctName.length - 1) {
        displayName = distinctName.substr(0, i).trim();
        const rightPart = distinctName.substr(i + 1, j - i - 1).trim();
        const idAndUniqueName = parseIdAndUniqueName(rightPart);
        id = idAndUniqueName.id;
        uniqueName = idAndUniqueName.uniqueName;
    }

    return {
        id: id,
        displayName: displayName,
        uniqueName: uniqueName,
        imageUrl: getIdentityImageUrl(id, uniqueName)
    };
}


function getVsIdFromGroupUniqueName(str: string): string {
    let leftPart: string;
    if (isNullOrWhiteSpace(str)) { return ""; }

    let vsid = null;
    const i = str.lastIndexOf("\\");
    if (i === -1) {
        leftPart = str;
    }
    else {
        leftPart = str.substr(0, i);
    }

    if (leftPart.startsWith("id:")) {
        const rightPart = leftPart.substr(3).trim();
        vsid = isGuid(rightPart) ? rightPart : "";
    }

    return vsid;
}


function parseIdAndUniqueName(str: string): { id: string, uniqueName: string } {
    if (isNullOrWhiteSpace(str)) {
        return { id: null, uniqueName: null };
    }

    const parts = str.split(";");
    if (parts.length === 1) {
        if (isGuid(parts[0])) {
            return { id: parts[0], uniqueName: null };
        }
        return { id: null, uniqueName: parts[0] };
    }
    else {
        return { id: parts[0], uniqueName: parts[1] };
    }
}