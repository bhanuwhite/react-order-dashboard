// tslint:disable-next-line: max-line-length
// Extracted from https://github.com/mui-org/material-ui/blob/2082679d80db7848cf47187a128a22491bf0b492/packages/material-ui/src/utils/setRef.js

// TODO: Make it private only in v5
export function setRef(ref: any, value: any) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
}