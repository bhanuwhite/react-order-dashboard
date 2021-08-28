import { azureCertificate } from '@/schemas';
import { Store } from '@/store';
import { getJSONStdMasResponse } from './helpers';

/**
 * Remove this code when unused
 * @deprecated
 */
export async function getDeviceCertificate(store: Store, deviceSerial: string) {
    const endpoint = `/es/enroll/device/${deviceSerial}/certs/azure`;
    const res = await getJSONStdMasResponse(store, endpoint, azureCertificate);

    if (res.success) {
        return res.response.response.certificate;
    } else {
        throw new Error(res.message);
    }
}