import { gt as semverGt, valid as semverValid } from 'semver';

/**
 * Ensure that what the user enters as version number for a new application is
 * 1) A valid semantic version string
 * 2) The new version nnumber is sequentially greater than the preevious
 * @param prevVersion
 * @param nextVersion
 */
export function validateSemanticVersion(prevVersion: string | undefined, nextVersion: string): string {
    if (!semverValid(nextVersion)) {
        return 'Version must be in semantic versioning format.';
    }
    if (prevVersion && !semverGt(nextVersion, prevVersion)) {
        return `New version must be sequentially higher than the previous version of ${prevVersion}`;
    }
    return '';
}

export const DEFAULT_JSON_SCHEMA = `{
    "title": "My application form",
    "description": "You need to enter additional information to use our application",
    "type": "object",
    "required": [
        "firstName",
        "lastName"
    ],
    "properties": {
        "firstName": {
            "type": "string",
            "title": "First name",
            "default": "Chuck"
        },
        "lastName": {
            "type": "string",
            "title": "Last name"
        },
        "age": {
            "type": "number",
            "title": "Age",
            "default": 99
        },
        "telephone": {
            "type": "string",
            "title": "Telephone",
            "minLength": 10
        }
    }
}`;