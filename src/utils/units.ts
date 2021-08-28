/**
 * Various units conversion helpers.
 */

/**
 * Multiply the argument to convert it from
 * minutes to milliseconds.
 *
 * @param val duration in minutes.
 * @return returns a duration in milliseconds
 */
export function minutes(val: number) {
    return seconds(val * 60);
}

/**
 * Multiply the argument to convert it from
 * seconds to milliseconds.
 *
 * @param val duration in seconds.
 * @return returns a duration in milliseconds
 */
export function seconds(val: number) {
    return val * 1_000;
}

/**
 * Convert a value in GiB to a number of bytes.
 * See https://en.wikipedia.org/wiki/Byte#Multiple-byte_units
 * for naming convention.
 *
 * @param val size in GiB
 * @return returns a size in bytes.
 */
export function GiB(val: number) {
    return MiB(val * 1024);
}

/**
 * Convert a value in MiB to a number of bytes.
 * See https://en.wikipedia.org/wiki/Byte#Multiple-byte_units
 * for naming convention.
 *
 * @param val size in MiB
 * @return returns a size in bytes.
 */
export function MiB(val: number) {
    return KiB(val * 1024);
}

/**
 * Convert a value in KiB to a number of bytes.
 * See https://en.wikipedia.org/wiki/Byte#Multiple-byte_units
 * for naming convention.
 *
 * @param val size in KiB
 * @return returns a size in bytes.
 */
export function KiB(val: number) {
    return val * 1024;
}