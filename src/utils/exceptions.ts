
export class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
    }
}

export class StructuredError<T> extends Error {

    constructor(
        public value: T,
        message: string,
    ) {
        super(message);
    }
}

export class Unreachable extends Error {
    constructor() { super('Unreachable code reached'); }
}