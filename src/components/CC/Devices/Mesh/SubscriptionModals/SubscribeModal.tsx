import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { MeshPackageState, EnrollmentMeshState } from '@/store/domain/enrollment';
import { useStore } from '@/hooks/useStore';
import { usePaymentDetailsFetcher, useMeshAvailableUpdatesFetcher, useIsWhitelistedFetcher } from '@/hooks/fetchers';
import { Button, Modal, Spinner, Once } from '@/components/core';
import { ErrorBody, SuccessBody } from '@/components/core';
import { AddPaymentCardBody } from '@/components/CC/AddPaymentCardModal';
import * as styles from './SubscribeModal.module.scss';
import { upgradeToPackage } from '@/actions/packages';
import { NodeState } from '@/store/domain/nodes';
import { PaymentSourceState } from '@/store/domain/account';
import { mergeFetchers } from '@/fetcher';
import { Link, useParams } from 'react-router-dom';
import { PackageConfigForm, PackageConfigFormDataPreview } from './PackageConfigForm';


// tslint:disable-next-line: variable-name
export const SubscribeModal: FC<Props> = observer(({
    manager, meshES, pkg, open, onClose, refreshAvailableSubscriptions,
}) => {

    // TODO: The code below is horrible, figure out a way to simplify it.
    //       The confusion is caused by the mix of step and loading things.
    //       Maybe we should use different state and have the steps enum be
    //       derived from it. That could be put in a class so that transitions
    //       can be tested separately.

    // tslint:disable-next-line: prefer-const
    const [step, setStep] = React.useState(Steps.LoadingInitData);
    const [isRestarting, setIsRestarting] = React.useState(false);
    const [shouldRefreshSubscriptionData, setShouldRefreshSubscriptionData] = React.useState(false);
    const [packageConfigData, setPackageConfigData] = React.useState<unknown>(null);
    const [error, setError] = React.useState('');
    const store = useStore();
    const { loading } = mergeFetchers(
        useMeshAvailableUpdatesFetcher(meshES.acsId),
        useIsWhitelistedFetcher(manager.id),
    );
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    const paymentDetails = usePaymentDetailsFetcher();
    const hasValidPaymentCard = store.domain.account.sources.hasValidPaymentCard;
    const defaultSource = store.domain.account.sources.defaultSource;
    const isWhitelisted = !!store.domain.whitelisting.get(manager.id);
    const isFree = pkg.type === 'Freemium';
    const hasUpdatesAvailable = store.domain.enrollment.availableUpdates.map.get(meshES.acsId)?.updateAvailable;
    const showingProgress = (step === Steps.LoadingInitData ||
        step === Steps.PendingReq ||
        step === Steps.LoadingPaymentData) && !hasUpdatesAvailable;

    React.useEffect(() => {
        // We iterate over all packages already installed. If we found one that would conflict with
        // any of the new apps, we prevent the installation from happening.
        const packages = meshES.men.packages;
        for (const pkgInstalled of packages) {

            if (pkg.wouldConflictWith(pkgInstalled)) {
                setError(`
                    You can't have ${pkgInstalled.title} and ${pkg.title} installed at the same time.
                    If you wish to proceed, please unsubscribe from the ${pkgInstalled.title} first
                `);
                setStep(Steps.Error);
                return;
            }
        }
    }, [pkg, meshES]);

    let className = `action-modal ${styles.packageUpgraderContainer}`;
    if (showingProgress) {
        className += ' running';
    }

    function resetAndClose() {
        setIsRestarting(false);
        setError('');
        setStep(Steps.LoadingInitData);
        if (shouldRefreshSubscriptionData) {
            refreshAvailableSubscriptions();
        }
        onClose();
    }

    async function doUpdate()  {
        setStep(Steps.PendingReq);
        setShouldRefreshSubscriptionData(true);
        try {
            const resp = await upgradeToPackage(store, manager, meshES, pkg, packageConfigData);
            if (!resp.success) {
                setError(resp.message);
                setStep(Steps.Error);
            } else {
                setIsRestarting(resp.response.will_reboot);
                setStep(Steps.Success);
            }
        } catch (err) {
            setStep(Steps.Error);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                console.error(err);
                setError(`An unknown error has occured`);
            }
        }
    }

    const handleContinueToBilling = () => {

        let nextStep: Steps;
        if (paymentDetails.loading) {
            nextStep = Steps.LoadingPaymentData;
        } else if (hasValidPaymentCard) {
            nextStep = Steps.Bill;
        } else {
            nextStep = Steps.Payment;
        }

        if (isWhitelisted || isFree) {
            doUpdate();
        } else {
            setStep(nextStep);
        }
    };

    return <Modal extended={!showingProgress} centered open={open}
        onClose={onClose} className={className}
    >
        {(() => {

            const { allowPkgSubscIfUpdatesAvailable } = store.view.debugOptions;
            // If we have an update available subscription isn't allowed.
            // AND if allowPkgSubscIfUpdatesAvailable from DebugOptions is enabled or set to true.
            const softwareUpdateNeededBeforeSubscription = hasUpdatesAvailable && !allowPkgSubscIfUpdatesAvailable;

            if (softwareUpdateNeededBeforeSubscription) {
                return <ErrorBody summary="You can't proceed with the upgrade."
                    description={<>
                        In order to subscribe to a new package, you need your software on{' '}
                        your hub to be up to date.<br />
                        Please navigate to your{' '}
                        <Link to={`/cc/${selectedGroupId}/devices/mesh/${meshES.id}`}>VeeaHub Mesh Overview tab</Link>{' '}
                        to update it.
                    </>}
                    onClose={resetAndClose}
                />;
            }

            const setStepAfterPackageConfigSubmit = () => {
                if (store.view.debugOptions.allowJSONSchemaFormPreview) {
                    setStep(Steps.PackageConfigFormDataPreview);
                } else {
                    handleContinueToBilling();
                }
            };

            // Switch according to the step.
            switch (step) {
                case Steps.Init: return <Step1
                    onContinue={() => {
                        if (pkg.packageConfigDataSchema) {
                            setStep(Steps.PackageConfig);
                        } else {
                            handleContinueToBilling();
                        }
                    }}
                    isNextPackage4G={pkg.requires4GCapability}
                    pkg={pkg}
                />;
                case Steps.PackageConfig: return <PackageConfigForm
                    schema={pkg.packageConfigDataSchema!}
                    setPackageConfigData={setPackageConfigData}
                    packageConfigData={packageConfigData}
                    onBack={() => setStep(Steps.Init)}
                    onConfirm={setStepAfterPackageConfigSubmit}
                    onClose={onClose}
                />;
                case Steps.PackageConfigFormDataPreview: return <PackageConfigFormDataPreview
                    packageConfigData={packageConfigData}
                    onBack={() => setStep(Steps.PackageConfig)}
                    onConfirm={handleContinueToBilling}
                />;
                case Steps.Payment: return <AddPaymentCardBody onCardSuccessfullyAdded={() => setStep(Steps.Bill)}/>;
                case Steps.Bill: return <BillingReviewStep defaultSrc={defaultSource!}
                    pkg={pkg}
                    onBack={() => {
                        if (pkg.packageConfigDataSchema) {
                            setStep(Steps.PackageConfig);
                        } else {
                            setStep(Steps.Init);
                        }
                    }}
                    onConfirm={doUpdate}
                />;
                case Steps.PendingReq:
                case Steps.LoadingInitData:
                case Steps.LoadingPaymentData: return <>
                    {step === Steps.LoadingInitData ?
                        <Once value={loading} equal={false} run={() => setStep(Steps.Init)}/> :
                        null
                    }
                    {step === Steps.LoadingPaymentData ?
                        <Once value={paymentDetails.loading} equal={false} run={() => setStep(hasValidPaymentCard ?
                            Steps.Bill :
                            Steps.Payment)}/> :
                        null
                    }
                    <Spinner text="Please wait" />
                </>;
                case Steps.Success: return <SuccessBody summary="Thank you for subscribing to this package."
                    description={<>
                        {isRestarting && !pkg.requires4GCapability && <>
                            Your VeeaHubs will now restart to download the new software package.<br />
                            This operation might take up to 20 minutes.<br />
                        </>}
                        {pkg.requires4GCapability && <>
                            You have upgraded to a 4G package, it might take up to 30 minutes for your{' '}
                            4G SIM card to be activated.
                        </>}
                    </>}
                    onClose={resetAndClose}
                />;
                case Steps.Error: return <ErrorBody summary="We couldn't upgrade your package."
                    description={<>Error: {error}. <br /> Please try again later or contact customer support.</>}
                    onClose={resetAndClose}
                />;
            }
        })()}
    </Modal>;
});

interface Props {
    manager: NodeState
    meshES: EnrollmentMeshState
    pkg: MeshPackageState
    open: boolean
    onClose: () => void
    refreshAvailableSubscriptions: () => void
}

const enum Steps {
    Init,
    Payment,
    Bill,
    LoadingInitData,
    LoadingPaymentData,
    PendingReq,
    Error,
    Success,
    PackageConfig,
    PackageConfigFormDataPreview,
}

/**
 * Step 1 is a high level description about what is going to happen.
 */
// tslint:disable-next-line: variable-name
const Step1: FC<Step1Props> = ({ pkg, isNextPackage4G, onContinue }) => (<>
    <h1>Subscribe to a new package</h1>
    <h2>This action will add a new package associated with your mesh.</h2>
    <div className={styles.upgradeFlowContainer}>
        <div className={styles.package}>
            <b>New Package</b>
            <i>{pkg.title}</i>
            <i>v{pkg.version}</i>
            <hr />
            <b>Cost</b>
            <i>{pkg.formattedPrice}</i>
        </div>
    </div>
    <div className={styles.packageUpgraderDisclosure}>
        {pkg.type !== 'Freemium' && <>
            Prices does not include any taxes applicable.{' '}
            You'll be shown the price including the tax once you enter your ZIP code during checkout.{' '}
        </>}
        {isNextPackage4G ? <>
            Please read <a target="_blank" href="https://www.veea.com/company/legal/4g-failover-terms-of-use/">
                4G Failover Terms of Use
            </a> before proceeding with this subscription.{' '}
            <br/>
        </> : null}
        You can cancel subscriptions any time.
    </div>
    <Button className={styles.continueBtn} wide success large onClick={onContinue}>Continue</Button>
</>);

interface Step1Props {
    pkg: MeshPackageState
    isNextPackage4G: boolean
    onContinue(): void
}

/**
 * BillingReviewStep is a recap of what the user is going to be charged.
 */
// tslint:disable-next-line: variable-name
const BillingReviewStep: FC<BillingReviewStepProps> = ({ pkg, defaultSrc, onBack, onConfirm }) => (<>
    <h1>Confirm Package</h1>
    <h2>Please make sure the information below is correct.</h2>
    {(() => {
        switch (defaultSrc.type) {
            case 'card':
                const addressValue: string[] = [];

                if (defaultSrc.city) {
                    addressValue.push(defaultSrc.city);
                }

                if (defaultSrc.country) {
                    addressValue.push(defaultSrc.country);
                }

                if (defaultSrc.state && defaultSrc.zip_code) {
                    addressValue.push(`${defaultSrc.state} / ${defaultSrc.zip_code}`);
                } else if (defaultSrc.state) {
                    addressValue.push(defaultSrc.state);
                } else if (defaultSrc.zip_code) {
                    addressValue.push(defaultSrc.zip_code);
                }

                return <>
                    <div className={styles.r} style={{marginTop: '30px'}}>
                        <div className={styles.b}>Cardholder Name</div>
                        <div className={styles.i}>{defaultSrc.cardholder_name ?? 'None'}</div>
                    </div>
                    <div className={styles.r}>
                        <div className={styles.b}>Payment Method</div>
                        <div className={styles.i}>{defaultSrc.brand} (•••• {defaultSrc.last4})</div>
                    </div>
                    <div className={styles.r}>
                        <div className={styles.b}>Address</div>
                        <div className={styles.i}>
                            {defaultSrc.address_line1 ?? 'No address given'}<br />
                            {defaultSrc.address_line2}<br />
                            {addressValue.filter(add => add !== '').join(', ')}</div>
                    </div>
                </>;
            default:
                return <>Not implemented yet</>;
        }
    })()}
    <div className={styles.r}>
        <div className={styles.b}>Package</div>
        <div className={styles.i}>{pkg.title} - {pkg.formattedPrice}</div>
    </div>
    <div className={styles.r}>
        <div className={styles.b}>Taxes (0%)</div>
        <div className={styles.i}>$0.00/mo</div>
    </div>
    <div className={styles.r} style={{ borderBottom: 0 }}>
        <div className={styles.b}>Total</div>
        <div className={styles.i}>{pkg.formattedPrice}</div>
    </div>
    <div className={styles.packageUpgraderDisclosure}>
        By clicking Upgrade Now, you authorize Veea, Inc. charge the total{' '}
        amount above inclusive of applicable taxes each month until you cancel the service.{' '}
        {pkg.requires4GCapability && <>For terms of service <a target="_blank" href="https://www.veea.com/company/legal/4g-failover-terms-of-use/">
            click here
        </a>.</>}
    </div>
    <div style={{ marginTop: '20px' }}>
        <Button wide className={styles.packageUpgraderBack} large onClick={onBack}>Go Back</Button>
        <Button wide success large onClick={onConfirm}>Upgrade Now</Button>
    </div>
</>);

interface BillingReviewStepProps {
    pkg: MeshPackageState
    defaultSrc: PaymentSourceState
    onBack(): void
    onConfirm(): void
}