import { computed, observable } from 'mobx';
import { HasFetcherProps } from '../_helpers';
import { compareBySemver, compareByPackageCommercialId, HasSemver, HasPackageCommercialId } from '@/utils/compare';



export interface ApplicationProps {
    id: string
    title: string
    active: boolean
    public: boolean
    version: string
    lastUpdatedAt: string | null
    lastUpdatedBy: string | null
    aclId: number | null
    aclName: string | null
    partnerId: string
    packageCommercialId: string
    description: string | null
    learnMore: string | null
    features: string[]
    packageConfigDataSchema: string | null
    persistentUuids: string[]
    appContainers: string[]
}

export class PartnerApplication implements HasFetcherProps<ApplicationProps> {

    readonly id: string;

    @observable
    props: ApplicationProps;

    get title() { return this.props.title; }
    get active() { return this.props.active; }
    get public() { return this.props.public; }
    get version() { return this.props.version; }
    get lastUpdatedAt() { return this.props.lastUpdatedAt; }
    get lastUpdatedBy() { return this.props.lastUpdatedBy; }
    get aclId() { return this.props.aclId; }
    get aclName() { return this.props.aclName; }
    get partnerId() { return this.props.partnerId; }
    get packageCommercialId() { return this.props.packageCommercialId; }
    get description() { return this.props.description; }
    get learnMore() { return this.props.learnMore; }
    get features() { return this.props.features; }
    get packageConfigDataSchema() { return this.props.packageConfigDataSchema; }
    get persistentUuids() { return this.props.persistentUuids; }
    get appContainers() { return this.props.appContainers; }

    // Temporary hack
    get isPartial() { return typeof this.props.features === 'undefined'; }

    /**
     * This returns true if the appContainers is not empty.
     * If it's empty it means that the payload was not valid
     * and the payload submission failed.
     *
     * In that case, the user is allowed to resubmit the payload
     * for that version.
     */
    get hasAppContainers(): boolean {
        return !!this.props.appContainers && this.props.appContainers.length > 0;
    }

    constructor(
        props: ApplicationProps,
    ) {
        this.id = props.id;
        this.props = props;
    }
}

interface ApplicationsByVersion {
    [appName: string]: PartnerApplication[]
}

export class ApplicationsState {

    readonly map = observable.map<string, PartnerApplication>();

    get size() {
        return this.map.size;
    }

    @computed
    get all(): PartnerApplication[] {
        return [...this.map.values()]
            .sort((a, b) => compareApplication(a.props, b.props));
    }

    // Aggregate the sorted partner applications by commercialId
    @computed
    get applicationsByVersion(): ApplicationsByVersion {
        const results: ApplicationsByVersion = {};
        for (const app of this.all) {
            const commercialId = app.packageCommercialId;
            if (!(commercialId in results)) {
                results[commercialId] = [];
            }
            results[commercialId].push(app);
        }
        return results;
    }
}

export function createApplications() {
    return new ApplicationsState();
}

/**
 * Primary sort by commercial ID and secondary by semantic version
 * @param a
 * @param b
 */
function compareApplication(a: HasSemver & HasPackageCommercialId, b: HasSemver & HasPackageCommercialId) {
    const byTitle = compareByPackageCommercialId(a, b);
    if (byTitle === 0) {
        return compareBySemver(a, b);
    }
    return byTitle;
}