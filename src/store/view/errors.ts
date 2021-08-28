import { observable } from 'mobx';
import { IError } from '@/components/core/Errors';

export interface ErrorsState {
    // -- Connectivity errors

    // -- Error list
    all: AnyErrorAllProps[]
    eventsError: IError | undefined
}

export type AnyErrorAllProps = AnyError & Common;

export interface Common {
    time: number
    count: number
}

export type AnyError = HttpError | SchemaError | ServerError;

// -- HTTP Statuses errors
// When a request returns a 40x or 50x we put it here.
// The user can later mark any of those error as seen.
export interface HttpError {
    type: 'http'
    endpoint: string
    statusCode: number
    method: string
}

// -- Schema errors
// This should not be visible in production but
// could happened for a long running browser and meanwhile
// the mas was updated (the user should refresh the webapp)
interface SchemaError {
    type: 'schema'
    endpoint: string
    path: string
    reason: string
}


// -- Server errors
// The server said there was an error in its response
interface ServerError {
    type: 'server'
    message: string
    data: unknown // can be null
}

export const createErrors = () => observable<ErrorsState>({
    all: [],
    eventsError: undefined,
});