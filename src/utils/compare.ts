import { gt as semverGt, lt as semverLt } from 'semver';


export interface HasSemver {
    version: string
}

/**
 * Compare function to sort an array using semantic versioning.
 *
 * Usage:
 *
 * ```ts
 * myArray.sort(compareBySemver);
 * ```
 */
export function compareBySemver(a: HasSemver, b: HasSemver) {
    if (semverGt(a.version, b.version)) {
        return -1;
    }
    if (semverLt(a.version, b.version)) {
        return 1;
    }
    return 0;
}

export interface HasPackageCommercialId {
    packageCommercialId: string
}

/**
 * Compare function to sort an array using the packageCommercialId property.
 *
 * Usage:
 *
 * ```ts
 * myArray.sort(compareByTitle);
 * ```
 */
export function compareByPackageCommercialId(a: HasPackageCommercialId, b: HasPackageCommercialId) {
    if (a.packageCommercialId > b.packageCommercialId) {
        return -1;
    }
    if (a.packageCommercialId < b.packageCommercialId) {
        return 1;
    }
    return 0;
}