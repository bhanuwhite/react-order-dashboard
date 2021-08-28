import * as React from 'react';
import { FC } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { VTPN_PROMOTIONAL_PACKAGE_COMMERCIAL_IDS } from '@/consts/vtpn-packages';
import { VmeshState } from '@/store/domain/vmeshes';
import { HealthStatus } from '@/store/derived/health';
import { EnrollmentMeshState, MeshPackageState } from '@/store/domain/enrollment';
import { usePackagesForMeshFetcher, useNodeFetcher, useAllSubscriptionsFetcher } from '@/hooks/fetchers';
import { useGroupsByIdFetcher, useIsWhitelistedFetcher } from '@/hooks/fetchers';
import { mergeFetchers } from '@/fetcher';
import { useStore } from '@/hooks/useStore';
import { Spinner, Separator, Button, Nothing } from '@/components/core';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { ResumeSubscriptionModal, SubscribeModal, UnsubscribeModal } from './SubscriptionModals';
import { StripeSubscriptionState } from '@/store/domain/account';
import * as style from './Subscriptions.module.scss';
import { Padding } from './Padding';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';


// tslint:disable-next-line: variable-name
export const Subscriptions: FC<Props> = observer(({ mesh, esData, updateMeshData }) => {

    const store = useStore();
    const { selectedGroupId, meshId } = useParams<{ selectedGroupId: string, meshId: string }>();

    const selectedGroup = store.domain.groups.map.get(selectedGroupId);
    const manager = store.domain.nodes.map.get(mesh?.managers[0] ?? '');
    const activePackages = store.domain.enrollment.packages.byMeshUUID.get(mesh?.props.uuid ?? '') ?? [];
    const subscribedPackages = store.domain.enrollment.meshes.map.get(manager?.id ?? '')?.men.packages ?? [];
    const isGroupContact = selectedGroup?.isGroupContact(store.view.activeuser.keycloakUUID) ?? false;
    const isWhitelisted = !!store.domain.whitelisting.get(manager?.id ?? '');

    const activeStripeSubscriptionsForMesh = manager ? store.domain.account.stripeSubscriptions.all.filter(sub => (
        sub.status !== 'canceled' && (
            sub.mesh_id === `${manager.props.vmeshId}` ||
            sub.mesh_uuid === esData?.acsId
        ) && sub.node_serial === manager.id
    )) : [];

    const { loading, error, fetchNow } = mergeFetchers(
        usePackagesForMeshFetcher(mesh?.props.uuid),
        useNodeFetcher(mesh?.id ?? ''),
        useAllSubscriptionsFetcher(),
        useGroupsByIdFetcher([ selectedGroupId ], { isInvalid: !selectedGroupId }),
        useIsWhitelistedFetcher(manager?.id),
    );

    const UUID_DELIMITER = '.';
    const persistentUuidSet = new Set(activePackages.map(pkg => pkg.persistentUuids.join(UUID_DELIMITER)));
    const subscribedButDeactivatedPackages = subscribedPackages
        .filter(pkg => !persistentUuidSet.has(pkg.persistentUuids.join(UUID_DELIMITER)));

    // TODO: consider putting that into the store
    //       and use the react router to be able to go back
    //       to that state.
    const [ pkgToModify, setPkgToModify ] = React.useState<MeshPackageState | null>(null);
    const [ subscriptionToModify, setSubcriptionToModify ] = React.useState<StripeSubscriptionState | null>(null);
    const [ subscribeOpen, setSubscribeOpen ] = React.useState(false);
    const [ unsubscribeOpen, setUnsubscribeOpen ] = React.useState(false);
    const [ resumeSubscriptionOpen, setResumeSubscriptionOpen ] = React.useState(false);

    function isCompatible(p: MeshPackageState): boolean {

        const { disablePkgSerialChecking } = store.view.debugOptions;

        // Check 4G capability.
        if (p.requires4GCapability) {
            if (manager) {
                return manager.is4GCapable || disablePkgSerialChecking;
            }
            // Can't do much here. :'(
            // But this should be unreachable.
        }
        // Good to go! :)
        return true;
    }

    if (loading && activePackages.length === 0) {
        return <div className="p-15 lg:p-30"><Spinner /></div>;
    }

    if (error) {
        return <Padding><MeshDeviceErrorsHandler error={error} /></Padding>;
    }

    const onSubscribe: OnSubscribeCallback = (pkg) => {
        setPkgToModify(pkg);
        setSubscribeOpen(true);
    };

    function refreshAvailableSubscriptions() {
        updateMeshData();
        fetchNow();
    }

    const onUnsubscribe: OnUnsubscribeCallback = (pkg) => {
        setPkgToModify(pkg);
        setUnsubscribeOpen(true);
    };

    const onResumeSubscription: OnResumeSubscriptionCallback = (pkg, sub) => {
        setPkgToModify(pkg);
        setSubcriptionToModify(sub);
        setResumeSubscriptionOpen(true);
    };

    function onModalClose() {
        setPkgToModify(null);
        setUnsubscribeOpen(false);
        setSubscribeOpen(false);
        setResumeSubscriptionOpen(false);
    }

    const shouldIncludeVtpn = store.view.debugOptions.showTrialVtpnSubscriptions;
    const nodeMENHealthStatus = store.derived.health.getNodeHealthStatus(manager);
    const meshHealthStatus = store.derived.health.getMeshHealthStatus(mesh, esData);
    const packagesToDisplay = activePackages
        .concat(subscribedButDeactivatedPackages)
        .filter(p => p.type !== 'Basic' && isCompatible(p) && (
            shouldIncludeVtpn || !VTPN_PROMOTIONAL_PACKAGE_COMMERCIAL_IDS.includes(p.packageCommercialId)
        ));

    return <div className="p-15 lg:p-30">
        <Separator className="mt-0" sticky>Subscriptions</Separator>
        <h3 className={style.comment}>
            Subscribe to a service to add additional features to your mesh.
            You can always unsubscribe later if you change your mind.
        </h3>
        <div className={style.availablePackageList}>
            {packagesToDisplay.map((pkg, i) =>
                <Subscription key={`${pkg.id}-${i}`}
                    pkg={pkg}
                    isGroupContact={isGroupContact}
                    isWhitelisted={isWhitelisted}
                    onSubscribe={onSubscribe}
                    onUnsubscribe={onUnsubscribe}
                    onResumeSubscription={onResumeSubscription}
                    meshHealthStatus={meshHealthStatus}
                    nodeMENHealthStatus={nodeMENHealthStatus}
                    activeStripeSubscriptionsForMesh={activeStripeSubscriptionsForMesh}
                    esData={esData}
                />,
            )}
            {packagesToDisplay.length === 0 &&
                <Nothing raw className="">
                    <div className="font-bold mb-10">Your mesh is not ready for subscriptions yet</div>
                    {
                        meshHealthStatus === 'busy' ?
                        <div className="font-size-14">
                            It looks like your mesh is busy. This means{' '}
                            <Link className="font-normal no-underline hover:underline text-primary" to={`/cc/${selectedGroupId}/devices/mesh/${meshId}/devices`}>
                                one or more VeeaHubs
                            </Link>{' '}
                            are bootstrapping.
                        </div> : <>
                            It looks like there's some issue with your mesh. If the problem{' '}
                            persists please contact customer support.
                        </>
                    }
                </Nothing>
            }
        </div>
        {pkgToModify && esData && <SubscribeModal open={subscribeOpen}
            pkg={pkgToModify}
            manager={manager!}
            meshES={esData}
            onClose={onModalClose}
            refreshAvailableSubscriptions={refreshAvailableSubscriptions}
        />}
        {pkgToModify && esData && <UnsubscribeModal open={unsubscribeOpen}
            pkg={pkgToModify}
            manager={manager!}
            meshES={esData}
            onClose={onModalClose}
            refreshAvailableSubscriptions={refreshAvailableSubscriptions}
            activeStripeSubscriptionsForMesh={activeStripeSubscriptionsForMesh}
        />}
        <ResumeSubscriptionModal
            open={resumeSubscriptionOpen}
            pkg={pkgToModify as MeshPackageState}
            sub={subscriptionToModify as StripeSubscriptionState}
            onClose={onModalClose}
        />
    </div>;
});

interface Props {
    mesh: VmeshState | undefined
    esData: EnrollmentMeshState | undefined
    updateMeshData: () => void
}


// tslint:disable-next-line: variable-name
const Subscription: FC<SubscriptionProps> = observer(({
    pkg,
    esData,
    isGroupContact,
    isWhitelisted,
    meshHealthStatus,
    nodeMENHealthStatus,
    onSubscribe,
    onUnsubscribe,
    onResumeSubscription,
    activeStripeSubscriptionsForMesh,
}) => {

    const matchingPackage = esData?.men.packages.find(p => arePackageSame(p, pkg));

    const subscriptionPendingCancelation = activeStripeSubscriptionsForMesh.find(sub => (
        sub.package_id === pkg.id && sub.cancel_at_period_end
    )) ?? null;

    const cancelAtDate = subscriptionPendingCancelation
        ? moment.unix(subscriptionPendingCancelation.cancel_at!).local().format('MMMM Do, YYYY')
        : null;

    function onClickChangeSubscribtion() {

        if (subscriptionPendingCancelation) {
            onResumeSubscription(pkg, subscriptionPendingCancelation);
        } else if (matchingPackage) {
            onUnsubscribe(matchingPackage);
        } else {
            onSubscribe(pkg);
        }
    }

    const meshAvailable = meshHealthStatus !== 'offline' && meshHealthStatus !== 'busy';
    const menNodeAvailable = nodeMENHealthStatus === 'healthy' ||
        // FIXME: Wait waaat???
        nodeMENHealthStatus === 'errors' ||
        nodeMENHealthStatus === 'need-reboot';
    const buttonDisabled = !meshAvailable || !menNodeAvailable || (
        !isWhitelisted && !isGroupContact && pkg.type === 'Premium'
    );
    const subscribe = !matchingPackage || !!subscriptionPendingCancelation;
    const buttonText = subscriptionPendingCancelation ? 'Resume Subscription' : matchingPackage ? 'Unsubscribe' : 'Subscribe';

    return <div className={style.availablePackage} data-qa-id={pkg.id}>
        <div className={style.packageTitle}>{pkg.massagedTitleWithVersion}</div>
        <div className={style.packageDescription}>{pkg.description}</div>
        <div className={style.packagePrice}>{pkg.formattedPrice}</div>
        <ul>
            {pkg.features.map(f => <li key={f}>{f}</li>)}
        </ul>
        <div className={style.packageFooter}>
            <div className={style.packageFooterLeft}>
                {pkg.learnMore !== null ? <a target="_BLANK" href={pkg.learnMore}>Learn more &rarr;</a> : null}
            </div>
            <div className={style.packageFooterRight}>
                {subscriptionPendingCancelation && <div className="font-size-14 font-bold absolute text-primary pr-20"
                    style={{
                        bottom: '65%',
                        left: '61%',
                    }}>
                    Will cancel on {cancelAtDate}
                </div>}
                <Button large primary={!subscribe} success={subscribe}
                    disabled={buttonDisabled} onClick={onClickChangeSubscribtion}
                    className={subscriptionPendingCancelation ? 'w-200 max-w-full' : ''}
                >
                    {buttonText}
                    {buttonDisabled && (
                        !isGroupContact && !isWhitelisted ?
                        <span className={style.meshOfflineTooltip}>
                            Cannot {subscribe ? 'subscribe' : 'unsubscribe'} as you are not{' '}
                            the Group Contact for this mesh
                        </span> :
                        <span className={style.meshOfflineTooltip}>
                            Cannot {subscribe ? 'subscribe' : 'unsubscribe'} while your
                            {meshHealthStatus !== 'healthy' ? ' VeeaHub Mesh ' : ' Gateway VeeaHub '}
                            has a status of {meshHealthStatus !== 'healthy' ? meshHealthStatus : nodeMENHealthStatus}
                        </span>
                    )}
                </Button>
            </div>
        </div>
    </div>;
});

type OnSubscribeCallback = (newPackage: MeshPackageState) => void;
type OnUnsubscribeCallback = (pkg: MeshPackageState) => void;
type OnResumeSubscriptionCallback = (pkg: MeshPackageState, sub: StripeSubscriptionState) => void;

interface SubscriptionProps {
    isGroupContact: boolean
    isWhitelisted: boolean
    esData: EnrollmentMeshState | undefined
    pkg: MeshPackageState
    meshHealthStatus: HealthStatus
    nodeMENHealthStatus: HealthStatus
    activeStripeSubscriptionsForMesh: StripeSubscriptionState[]
    onUnsubscribe: OnUnsubscribeCallback
    onSubscribe: OnSubscribeCallback
    onResumeSubscription: OnResumeSubscriptionCallback
}

interface HasPersistentUuids {
    persistentUuids: string[]
}

function arePackageSame(p1: HasPersistentUuids, p2: HasPersistentUuids): boolean {
    if (p1.persistentUuids.length !== p2.persistentUuids.length) {
        return false;
    }
    for (let i = 0; i < p1.persistentUuids.length; i++) {
        const p1puuid = p1.persistentUuids[i];
        const p2puuid = p2.persistentUuids[i];
        if (p1puuid !== p2puuid) {
            return false;
        }
    }
    return p1.persistentUuids.length > 0;
}
