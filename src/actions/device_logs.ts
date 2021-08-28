import { getJSONStdMasResponse, getPlainTextStdMasResponse, postJSONStdMasResponse } from './helpers';
import { deviceLogsSchema, ignoreSchema } from '@/schemas';
import { Store } from '@/store';


export async function fetchLogFileList(store: Store, dateRange: DateRange, unitSerial: string): Promise<string[]> {
    const endpoint = `/mas/v1/vhlog/${unitSerial}?after=${encodeURIComponent(dateRange.start)}&before=${encodeURIComponent(dateRange.end)}`;
    const res = await getJSONStdMasResponse(store, endpoint, deviceLogsSchema);
    if (!res.success) {
        throw new Error(res.message);
    } else {
        return res.response.map(log => log.Name);
    }
}

export async function rotateLogFile(store: Store, masNodeId: string) {
    const endpoint = `/mas/v2/nodes/${masNodeId}/log/request`;
    const res = await postJSONStdMasResponse(store, endpoint, null, ignoreSchema);
    if (!res.success) {
        throw new Error(res.message);
    } else {
        return res.response;
    }
}

export async function downloadLogFile(store: Store, unitSerial: string, logFileName: string) {
    const endpoint = `/mas/v1/vhlog/${unitSerial}/${logFileName}`;
    const res = await getPlainTextStdMasResponse(store, endpoint);
    if (!res.success) {
        throw new Error(res.message);
    } else {
        return res.response.raw;
    }
}

interface DateRange {
    start: string
    end: string
}