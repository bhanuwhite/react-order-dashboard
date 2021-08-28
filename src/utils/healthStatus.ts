import { HealthStatus } from '@/store/derived/health';

/**
 * Convert the health into a shortname that can be shown
 * as a short status to a user.
 * @param health health status to convert.
 */
export function healthToShortname(health: HealthStatus): string {
    if (health === 'need-reboot') {
        return 'Action';
    }
    return health;
}

/**
 * Convert the health into a title that can be shown.
 * @param health health status to convert.
 */
export function healthToTitle(health: HealthStatus): string {
    if (health === 'need-reboot') {
        return 'Reboot required';
    }
    return health;
}

/**
 * Convert a health to a longer description that can be shown
 * to a user. Typically this would be shown in a tooltip.
 * @param health health status to convert.
 */
export function healthToDescription(health: HealthStatus): string {
    switch (health) {
        case 'need-reboot': return 'A reboot is required for your changes to take effect.';
        case 'healthy': return 'All good.';
        case 'installing': return 'Some software is currently being installed.';
        case 'offline': return 'Offline';
        case 'unknown': return 'Health status is not available at this time.';
        case 'errors': return 'Some errors have been encountered.';
        case 'busy': return 'Some tasks are running.';
    }
}