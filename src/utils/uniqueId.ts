
let lastId = 0;

export function uniqueId(prefix?: string): string {
    if (prefix) {
        return `${prefix}${++lastId}`;
    }
    return `${++lastId}`;
}

export function newIdGenerator(prefix?: string): () => string {
    return () => uniqueId(prefix);
}