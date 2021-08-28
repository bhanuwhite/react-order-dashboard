/**
 * Wait the provided amount of ms.
 * @param ms number of ms to wait.
 */
export function waitForMs(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}