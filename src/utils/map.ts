export function toArray<T>(map: { [key: string]: T } | { [key: number]: T }): T[] {
    return Object.keys(map).map(x => map[x]);
}