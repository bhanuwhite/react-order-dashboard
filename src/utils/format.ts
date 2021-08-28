/**
 * Formatting helpers
 */


/**
 * Format value / total to show a percentage (no more than 2 digits.)
 * @param value an integer (could be a float) between 0 and total.
 * @param total an integer (could be a float) greater than 0.
 */
export function formatPercent(value: number, total: number): string {
    // Intl.NumberFormat
    if (value === 0) {
        return '0';
    }
    const pct = value * 100 / total;
    if (pct < 1) {
        return `${pct.toFixed(2)}`;
    }
    return `${pct.toFixed(0)}`;
}


/**
 * Format role name
 */
export function formatRole(roleName: string): string {
    if (roleName === 'group_admin') {
        return 'Administrator';
    }
    if (roleName === 'regular') {
        return 'User';
    }
    return roleName;
}