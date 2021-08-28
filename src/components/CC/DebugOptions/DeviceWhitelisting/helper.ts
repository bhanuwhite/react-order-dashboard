import { isEmpty } from 'lodash';

/**
 * Parses unit serial string list, that can come from csv file content
 *
 * @param list string can have spaces and new lines due the csv file content
 * @returns string[]
 */
export function parseUnitSerials(list: string) {
    return list.trim().split(/,|\n/g).filter(us => !isEmpty(us));
}

export function isUnitSerialFormatValid(unitSerial: string) {
    return unitSerial.match(/^[A-Z0-9]{20}$/g);
}

export function allMultipleUnitSerialValid(unitSerials: string) {
    return parseUnitSerials(unitSerials)
        .every(us => isUnitSerialFormatValid(us));
}
