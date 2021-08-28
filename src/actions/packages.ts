import { postJSONStdMasResponse, RequestResult } from './helpers';
import { upgradeResponse, downgradeResponse, updateResponse } from '@/schemas/self-api';
import { EnrollmentMeshState, MeshPackageState } from '@/store/domain/enrollment';
import { NodeState } from '@/store/domain/nodes';
import { Store } from '@/store';


/**
 * Install a new package. Historically referred as the upgrade and will
 * likely be referred as an upgrade in the near future.
 *
 * Thus the confusing name.
 *
 * @param manager MEN of the mesh
 * @param acsData Enrollment service data for this mesh
 * @param pkg Package to upgrade to
 * @param packageConfigData Form data for package specific configuration
 */
export async function upgradeToPackage(
    store: Store,
    manager: NodeState,
    acsData: EnrollmentMeshState,
    pkg: MeshPackageState,
    packageConfigData: unknown,
): Promise<RequestResult<{will_reboot: boolean}>> {

    if (manager.id !== acsData.men.id) {
        throw new Error('Invalid use of upgradeToPackage');
    }

    const body = {
        mesh: {
            uuid: acsData.acsId,
            masId: manager.props.vmeshId,
        },
        manager: {
            is4GCapable: manager.is4GCapable,
            unitSerial: manager.id,
        },
        pkg: {
            type: pkg.type,
            packageId: pkg.id,
            requires4GCapability: pkg.requires4GCapability,
            storeProductId: pkg.storeProductId,
            packageConfigData: packageConfigData ? JSON.stringify(packageConfigData) : null,
        },
    };
    const res = await postJSONStdMasResponse(store, '/subscriptions/upgrade', body, upgradeResponse);
    if (res.success) {
        return res.response;
    }
    return res;
}


/**
 * Uninstall a package. Historically referred as the downgrade and will
 * likely be referred as a downgrade in the near future.
 *
 * Thus the confusing name.
 *
 * @param manager MEN of the mesh
 * @param acsData Enrollment service data for this mesh
 * @param pkg Package to downgrade.
 */
export async function downgradeFromPackage(
    store: Store,
    manager: NodeState,
    acsData: EnrollmentMeshState,
    pkg: MeshPackageState,
): Promise<RequestResult<{ will_reboot: boolean }>> {

    if (manager.id !== acsData.men.id) {
        throw new Error('Invalid use of downgradeFromPackage');
    }

    const body = {
        mesh: {
            uuid: acsData.acsId,
            masId: manager.props.vmeshId,
        },
        manager: {
            is4GCapable: manager.is4GCapable,
            unitSerial: manager.id,
        },
        pkg: {
            type: pkg.type,
            packageId: pkg.id,
            requires4GCapability: pkg.requires4GCapability,
            storeProductId: pkg.storeProductId,
        },
    };
    const res = await postJSONStdMasResponse(store, '/subscriptions/downgrade', body, downgradeResponse);
    if (res.success) {
        return res.response;
    }
    return res;
}

export interface PackageUpdate {
    /** Type of the package */
    type: 'Premium' | 'Basic' | 'Freemium'
    /** New package installed */
    newPackageId: string
    /** Package being replaced */
    oldPackageId: string
}

/**
 * Update software running on a mesh.
 * @param meshUUID uuid of the mesh (also known as ACS Id of the mesh)
 * @param menUnitSerial unit serial of the MEN (also known as manager)
 * @param meshId id of the mesh in the MAS
 * @param packages list of package to update.
 */
export function updateSoftware(
    store: Store,
    meshUUID: string,
    menUnitSerial: string,
    meshId: number | null, // TODO: we should update stripe subscription to use the meshUUID instead
    packages: PackageUpdate[],
): Promise<RequestResult<{}>> {

    const body = {
        meshUUID,
        meshId,
        menUnitSerial,
        packages,
    };

    return postJSONStdMasResponse(store, '/subscriptions/update', body, updateResponse);
}