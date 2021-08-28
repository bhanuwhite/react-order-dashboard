import { action } from 'mobx';
import { FetcherInstance } from '../instance';
import { enrollUserConfig, availableUpdates, allPackages, NonSchemaPackageDefinition, azureCertificate } from '@/schemas';
import { Store } from '@/store';
import { MeshPackage } from '@/store/domain/enrollment';
import { Value } from '@/store/domain/_helpers';
import { updateProps } from '@/utils/obj';
import { updateMap, updateMapWithClass, updateOneEntryWithClass } from './helpers';
import { MeshPackageState, MeshAvailableUpdatesState, MeshAvailableUpdatesProps } from '@/store/domain/enrollment';


export function handleESEndpoints(instance: FetcherInstance, store: Store) {

    // Owner config
    instance.get('/es/enroll/owner/:ownerId/config', async (res, { ownerId }) => {
        const result = enrollUserConfig.validate(res.body);
        if (result.type === 'error') {
            return result;
        }
        const { meta, response } = result.value;
        if (meta.status !== 200) {
            return meta.message || `Status code is ${meta.status} (!= 200)`;
        }

        // Let's go and inject into the store
        // the response we had from the enrollment service.
        const meshes = response.meshes!;

        try {
            // FIXME: We should probably cache the result under "ownerId" instead of discarding everything.

            action(() => {
                store.domain.enrollment.nodes.map.clear();
            })();

            updateMap(store.domain.enrollment.meshes, meshes, (mesh) => {

                // if there is only one device found in a mesh, it must be MEN
                const menIndex = mesh.devices.length !== 1
                    ? mesh.devices.findIndex(d => d.isMEN)
                    : 0;

                if (menIndex === -1) {
                    console.error('Enrollment service reported a mesh with no MEN');
                    return null;
                }
                // The unique id of the mesh is the unit serial of the men
                const meshId = mesh.devices[menIndex].id ?? 'bug';
                const devices = mesh.devices.map(d => ({
                    id: d.id ?? '',
                    meshId,
                    name: d.name ?? '',
                    status: d.status ?? '',
                    progress: d.progress,
                    error: d.error,
                    isMEN: !!d.isMEN,
                    packages: d.packages.map(pkg => new MeshPackageState(transformPackageData(pkg))),
                }));
                devices.forEach(d => store.domain.enrollment.nodes.map.set(d.id, d));

                return {
                    acsId: mesh.id ?? '',
                    groupId: ownerId,
                    id: meshId,
                    name: mesh.name ?? '',
                    men: devices[menIndex],
                    devices: new Map(function*() {
                        for (const d of devices) {
                            yield [d.id, d] as const;
                        }
                    }()),
                };
            });
        } catch (err) {
            return err;
        }
    });

    // Available updates
    instance.get('/es/subscription/mesh/:meshId/availableUpdates', async (res, { meshId }) => {
        const result = availableUpdates.validate(res.body);
        if (result.type === 'error') {
            return result;
        }
        const { meta, response } = result.value;
        if (meta.status !== 200) {
            return meta.message || `Status code is ${meta.status} (!= 200)`;
        }

        const updates: Value & MeshAvailableUpdatesProps = {
            id: meshId,
            updates: response.updates.filter(pkg => pkg.packageUpdate !== null).map(pkg => ({
                newVersion: pkg.packageUpdate!.version,
                currentVersion: pkg.package.version,
                title: pkg.package.title,
                newPackageId: pkg.packageUpdate!.packageId,
                oldPackageId: pkg.package.packageId,
                type: pkg.package.type,
            })),
        };

        updateOneEntryWithClass(store.domain.enrollment.availableUpdates.map, MeshAvailableUpdatesState, updates);

    });

    // Packages for a mesh
    instance.get('/es/subscription/mesh/:meshUUID/availableSubscriptions', async (res, { meshUUID }) => {
        const result = allPackages.validate(res.body);
        if (result.type === 'error') {
            return result;
        }
        const { meta, response } = result.value;
        if (meta.status !== 200) {
            return meta.message || `Status code is ${meta.status} (!= 200)`;
        }

        action(() => {
            const availablePackages: MeshPackageState[] = [];
            for (const pck of response) {
                const { id, ...props } = transformPackageData(pck);
                let storeValue = store.domain.enrollment.packages.map.get(id);
                if (storeValue) {
                    updateProps(storeValue.props, props);
                } else {
                    storeValue = new MeshPackageState({ id, ...props });
                    store.domain.enrollment.packages.map.set(id, storeValue);
                }
                availablePackages.push(storeValue);
            }
            availablePackages.sort((a, b) => {
                if (a.title < b.title) {
                    return 1;
                }
                if (a.title > b.title) {
                    return -1;
                }
                return 0;
            });
            store.domain.enrollment.packages.byMeshUUID.set(meshUUID, availablePackages);
        })();
    });

    // Azure cert
    instance.get('/es/enroll/device/:deviceId/certs/azure', async (res, { deviceId }) => {
        const result = azureCertificate.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        action(() => {
            const dev = store.domain.enrollment.nodes.map.get(deviceId);
            if (!dev) {
                throw new Error('Bug found, should not have happened');
            }
            dev.azureCert = result.value.response.certificate;
        })();
    });

    // Packages
    instance.get('/es/enroll/packages', async (res) => {
        const result = allPackages.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const { response } = result.value;
        updateMapWithClass(store.domain.enrollment.packages, MeshPackageState, response, transformPackageData);
    });
}

const transformPackageData = (pkg: NonSchemaPackageDefinition): MeshPackage & { id: string } => ({
    id: pkg.packageId,
    description: pkg.description ?? '',
    title: pkg.title,
    version: pkg.version,
    features: pkg.features.filterNullable(),
    learnMore: pkg.learnMore,
    persistentUuids: pkg.persistentUuids.sort(),
    pricing: pkg.pricing ?? '',
    storeProductId: pkg.storeProductId,
    type: pkg.type,
    requires4GCapability: pkg.packageApplicationTypes.some(v => v === 'cellular-backhaul' || v === 'sdwan'),
    packageConfigDataSchema: pkg.packageConfigDataSchema,
    packageCommercialId: pkg.packageCommercialId,
    packageApplicationTypes: pkg.packageApplicationTypes,
});