

/**
 * Remove `&prev=` or `&next=` from `fullpathname`.
 * This function assumes that the query argument is last.
 *
 * @param fullpathname path
 */
export function removeNextOrPrev(fullpathname: string): string {

    let i = fullpathname.indexOf('next=');

    if (i !== -1) {
        return fullpathname.slice(0, i - 1); // -1 is for the & or ?
    }

    i = fullpathname.indexOf('prev=');

    if (i !== -1) {
        return fullpathname.slice(0, i - 1); // -1 is for the & or ?
    }

    return fullpathname;
}