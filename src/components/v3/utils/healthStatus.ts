import { HealthStatus } from '@/store/derived/health';

export function healthToShortnameForNode(status: HealthStatus): string {
    switch (status) {
        case 'busy': return 'Busy';
        case 'errors': return 'Error(s)';
        case 'healthy': return 'Healthy';
        case 'offline': return 'Offline';
        case 'need-reboot': return 'Reboot required';
        case 'unknown': return 'Unknown';
        case 'installing': return 'Bootstrapping';
    }
}

export function healthToShortnameForMesh(status: HealthStatus): string {
    switch (status) {
        case 'busy': return 'Busy';
        case 'errors': return 'Error(s)';
        case 'healthy': return 'Healthy';
        case 'offline': return 'Offline';
        case 'need-reboot': return 'Reboot required';
        case 'unknown': return 'Unknown';
        case 'installing': return 'Bootstrapping';
    }
}

export function computeStatusColor(status: HealthStatus): string {
    switch (status) {
        case 'busy': return 'bg-purple-200';
        case 'errors': return 'bg-gray-200';
        case 'healthy': return 'bg-good';
        case 'offline': return 'bg-bad';
        case 'need-reboot': return 'bg-yellow-500';
        case 'unknown': return 'bg-bad';
        case 'installing': return 'bg-yellow-500';
    }
}