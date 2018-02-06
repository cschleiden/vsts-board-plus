export function css(...parts: (string | undefined)[]): string {
    return parts.filter(x => !!x).join(" ");
}