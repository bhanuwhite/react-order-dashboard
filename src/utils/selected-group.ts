const SELECTED_GROUP_ID_REGEX = /^\/(?:cc\/){0,1}([^\/]{36})(\/|$)/;

export function getSelectedGroupIdFromPathname(pathname: string): string | undefined {
    const match = SELECTED_GROUP_ID_REGEX.exec(pathname);
    if (match !== null) {
        return match[1];
    }
}