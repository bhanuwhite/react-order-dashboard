import { EnrollmentMeshState } from '@/store/domain/enrollment';
import { postJSONStdMasResponse, RequestResult } from './helpers';
import { unenrollResponse } from '@/schemas/self-api';
import { Store } from '@/store';


// post an unenrollment request to the backend enrollment endpoint
// TODO misleading to use postJSONStdMasResponse() for this since
// it's going to ES via the backend, not to the MAS
export async function unenrollMesh(
    store: Store,
    meshId: string,
    { id, devices }: EnrollmentMeshState,
): Promise<RequestResult<{}>> {

    // device list has manager as well as workers so filter out
    const workers = [...devices.keys()].filter(d => d !== id);

    // make sure workers excludes the manager device
    const body = {
        masMeshId: meshId,
        manager: id,
        workers,
    };
    const res = postJSONStdMasResponse(store, `/enrollment/unenroll`, body, unenrollResponse);

    return res;
}

