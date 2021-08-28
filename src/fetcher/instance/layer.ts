import { pathToRegexp, Key } from 'path-to-regexp';

type MatchResult = MatchSuccess | MatchFailed;

interface MatchFailed {
    type: 'failed'
}

interface MatchSuccess {
    type: 'success'
    params: Record<string | number, string>
    path: string
}


export class Layer {

    pathDebug: string; // Only for debug purposes

    private regexp: RegExp;
    private keys: Key[] = [];

    constructor(path: string) {
        this.pathDebug = path;
        this.regexp = pathToRegexp(path, this.keys, {});
    }

    match(path: string): MatchResult {
        const match = this.regexp.exec(path);
        if (!match) {
            return { type: 'failed' };
        }

        const params: Record<string | number, string> = {};

        for (let i = 1; i < match.length; i++) {
            const key = this.keys[i - 1];
            const prop = key.name;

            try {
                const val = decode_param(match[i]);
                if (val !== undefined && !(Object.hasOwnProperty.call(params, prop))) {
                    params[prop] = val;
                }
            } catch (err) {
                console.error(err);
                return { type: 'failed' };
            }
        }

        return {
            type: 'success',
            params,
            path: match[0],
        };
    }
}

function decode_param(val: string): string | undefined {
    if (typeof val !== 'string' || val.length === 0) {
        return val;
    }

    try {
        return decodeURIComponent(val);
    } catch (err) {
        if (err instanceof URIError) {
            err.message = 'Failed to decode param \'' + val + '\'';
        }

        throw err;
    }
}