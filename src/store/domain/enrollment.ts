// tslint:disable: max-classes-per-file
import { observable, computed, ObservableMap } from 'mobx';
import { VTPN_PROMOTIONAL_PACKAGE_COMMERCIAL_IDS } from '@/consts/vtpn-packages';
import { HasFetcherProps, Value } from './_helpers';


export interface EnrollmentMeshState {
    // This is the same as the MEN unit serial
    // This is the only id that is shared between the MAS and ACS.
    id: string
    // This is the id used by ACS.
    acsId: string
    // Group id (owner id)
    groupId: string
    name: string
    men: EnrollmentDeviceState
    devices: Map<string, EnrollmentDeviceState>
}

export interface EnrollmentDeviceState {
    id: string
    meshId: string
    name: string
    status: string
    isMEN: boolean
    progress: number | null
    error: { code: number | null, message: string | null, logs: string | null } | null
    packages: MeshPackageState[]
    azureCert?: string
}

export interface MeshAvailableUpdate {
    type: 'Premium' | 'Basic' | 'Freemium'
    newVersion: string
    currentVersion: string
    newPackageId: string
    oldPackageId: string
    title: string
}

export interface MeshAvailableUpdatesProps {
    updates: MeshAvailableUpdate[]
}

export class MeshAvailableUpdatesState implements HasFetcherProps<MeshAvailableUpdatesProps> {
    /** ACS id of the mesh */
    readonly id: string;

    /**
     * Returns true if an update is available.
     */
    get updateAvailable(): boolean {
        return this.props.updates.length > 0;
    }

    @observable
    props: MeshAvailableUpdatesProps;

    constructor(
        { id, ...props }: Value & MeshAvailableUpdatesProps,
    ) {
        this.id = id;
        this.props = props;
    }
}

export interface MeshPackage {
    /** title in ES payload */
    title: string
    /** version in ES payload */
    version: string
    /** type in ES payload */
    type: 'Premium' | 'Freemium' | 'Basic'
    /** pricing in ES payload */
    pricing: string
    /** description in ES payload */
    description: string
    /** learnMore in ES payload */
    learnMore: string | null
    /** features in ES payload */
    features: string[]
    /** storeProductId in ES payload */
    storeProductId: string | null
    /** persistentUuids in ES payload (sorted) */
    persistentUuids: string[]
    /** inferred by response handler */
    requires4GCapability: boolean
    /** schema used to generate form for package specific configuration */
    packageConfigDataSchema: string | null
    /** id used for commercial grouping purposes */
    packageCommercialId: string
    /** package application types */
    packageApplicationTypes: string[]
}

export class MeshPackageState implements HasFetcherProps<MeshPackage> {

    /** packageId in ES payload */
    readonly id: string;
    /** title in ES payload */
    get title() { return this.props.title; }
    /** version in ES payload */
    get version() { return this.props.version; }
    /** type in ES payload */
    get type() { return this.props.type; }
    /** pricing in ES payload */
    get pricing() { return this.props.pricing; }
    /** description in ES payload */
    get description() { return this.props.description; }
    /** learnMore in ES payload */
    get learnMore() { return this.props.learnMore; }
    /** features in ES payload */
    get features() { return this.props.features; }
    /** storeProductId in ES payload */
    get storeProductId() { return this.props.storeProductId; }
    /** persistentUuids in ES payload (sorted) */
    get persistentUuids() { return this.props.persistentUuids; }
    /** inferred by response handler */
    get requires4GCapability() { return this.props.requires4GCapability; }
    /** schema used to generate form for package specific configuration */
    get packageConfigDataSchema() { return this.props.packageConfigDataSchema; }
    /** id used for commercial grouping purposes */
    get packageCommercialId() { return this.props.packageCommercialId; }

    /**
     * Returns the list of apps this package would install.
     */
    @computed({ keepAlive: true })
    get apps(): Set<string> {
        // This set is empty if there will never be any conflict
        return new Set(this.props.packageApplicationTypes);
    }

    /**
     * Returns true if the provided packages (assumed ot be already installed
     * on a mesh) would conflict with this one.
     * @param installedPkg package to compare with.
     */
    wouldConflictWith(installedPkg: MeshPackageState): boolean {

        // Two package conflict with one another if they share a value in their packageApplicationTypes.
        // Empty array means the package does not conflict with anything.
        return installedPkg.props.packageApplicationTypes.some(appType => this.apps.has(appType));
    }

    @computed
    get formattedPrice() {
        let formattedPrice = 'FREE';

        // We should make sure the price is always stored as a string
        // See https://medium.com/selency-tech-product/your-balance-is-0-30000000004-b6f7870bd32e
        const priceInFloat = Number.parseFloat(this.pricing);
        if (priceInFloat > 0) {
            // For now this is probably fine, but we should consider using
            // a proper library to convert.
            formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(priceInFloat) + '/mo';
        }
        return formattedPrice;
    }

    /**
     * Remove any version information from title string
     * and concatenate this to the version value from the `pkg.version` field
     */
    @computed
    get massagedTitleWithVersion() {
        const massagedTitle = this.title.replaceAll(`(${this.version})`, '').trim();
        return `${massagedTitle} (${this.version})`;
    }

    @observable
    props: MeshPackage;

    constructor(
        { id, ...props }: Value & MeshPackage,
    ) {
        this.id = id;
        this.props = props;
    }
}

export interface EnrollmentState {
    /** Meshes known by the enrollment service. */
    meshes: {
        /** A Map to access a mesh with the MEN's unitSerial. */
        map: ObservableMap<string, EnrollmentMeshState>,
        /** An array of all the mesh. */
        all: EnrollmentMeshState[],
        /**
         * Returns true if the user has at least one mesh
         * with at least on Privafy related package installed
         */
        haveAnyPrivafyPackages: boolean,
        /**
         * Returns true if the user has at least one mesh
         * with at least on vTPN promotional package installed
         */
        haveAnyVtpnPromoPackages: boolean,
    }
    /** Nodes known by the enrollment service */
    nodes: {
        /** A Map to access a device with the MEN's unitSerial. */
        map: Map<string, EnrollmentDeviceState>,
        /** An array of all the device. */
        all: EnrollmentDeviceState[],
    }
    /** Software updates that are availables for meshes */
    availableUpdates: {
        /** A map to access the available update of a mesh. The key is the acsId of the mesh.  */
        map: ObservableMap<string, MeshAvailableUpdatesState>,
    }
    /** Packages available to install for the currently logged in user. */
    packages: {
        /** Packages keyed by packageId */
        map: ObservableMap<string, MeshPackageState>,
        /** List of package by mesh uuid, note that the reference are shared with the map. */
        byMeshUUID: ObservableMap<string, MeshPackageState[]>,
    }
}

export const createEnrollment = () => observable<EnrollmentState>({
    meshes: {
        map: observable.map<string, EnrollmentMeshState>(),
        get all(): EnrollmentMeshState[] {
            return [...this.map.values()];
        },
        get haveAnyPrivafyPackages(): boolean {
            return this.all.some(mesh =>
                mesh.men.packages.some(pckg =>
                    pckg.persistentUuids.some(uuid =>
                        uuid === PRIVAFY_PERSISTENT_UUID)));
        },
        get haveAnyVtpnPromoPackages(): boolean {
            return this.all.some(mesh =>
                mesh.men.packages.some(({ packageCommercialId }) =>
                    VTPN_PROMOTIONAL_PACKAGE_COMMERCIAL_IDS.includes(packageCommercialId)));
        },
    },
    nodes: {
        map: observable.map<string, EnrollmentDeviceState>(),
        get all(): EnrollmentDeviceState[] {
            return [...this.map.values()];
        },
    },
    availableUpdates: {
        map: observable.map<string, MeshAvailableUpdatesState>(),
    },
    packages: {
        map: observable.map<string, MeshPackageState>(),
        byMeshUUID: observable.map<string, MeshPackageState[]>(),
    },
});

const PRIVAFY_PERSISTENT_UUID = '00000000-BA5E-5AFE-F0B5-000000000005';