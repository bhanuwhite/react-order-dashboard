import { FC } from 'react';
import { EnrollmentMeshState, MeshPackageState } from '@/store/domain/enrollment';
import { NodeState } from '@/store/domain/nodes';
import { Button, ActionModal } from '@/components/core';
import { downgradeFromPackage } from '@/actions/packages';
import { cancelSubscription } from '@/actions/subscriptions';
import { useIsWhitelistedFetcher } from '@/hooks/fetchers';
import * as style from './UnsubscribeModal.module.scss';
import { useStore } from '@/hooks/useStore';
import { StripeSubscriptionState } from '@/store/domain/account';


// tslint:disable-next-line: variable-name
export const UnsubscribeModal: FC<Props> = ({
    manager, meshES, pkg, open, onClose, refreshAvailableSubscriptions, activeStripeSubscriptionsForMesh,
}) => {

    const store = useStore();

    useIsWhitelistedFetcher(manager.id);

    const isWhitelisted = !!store.domain.whitelisting.get(manager.id);
    const isFree = pkg.type === 'Freemium';

    const stripeSubscription = activeStripeSubscriptionsForMesh.find(sub => (
        !sub.cancel_at_period_end && !sub.canceled_at && !sub.cancel_at && sub.package_id === pkg.id
    )) ?? null;

    return <ActionModal extended centered open={open} onClose={onClose}
        cancelBtnText="Go Back"
        actions={[
            {
                text: 'Unsubscribe',
                type: 'primary' as const,
                run: async () => {
                    let errorMessage = '';
                    if (isWhitelisted || isFree) {
                        const res = await downgradeFromPackage(store, manager, meshES, pkg!);
                        if (res.success) {
                            refreshAvailableSubscriptions();
                            return {
                                success: true,
                                summary: 'Your mesh subscription has been cancelled.',
                                description: <>
                                    Your VeeaHubs will now restart in order to unsubscribe from the{' '}
                                    software package.<br />
                                    This operation might take up to 20 minutes.
                                </>,
                            };
                        } else {
                            errorMessage = res.message;
                        }
                    } else {
                        if (!stripeSubscription) {
                            return {
                                success: false,
                                summary: 'We couldn\'t downgrade your package.',
                                description: <>
                                    No stripe subscription found! This error can only happen in two circumstances.{' '}
                                    Either the stripe metadata has been modified by an external service, or your mesh{' '}
                                    used to be whitelisted but it's no longer the case.
                                </>,
                            };
                        }
                        const res = await cancelSubscription(store, [ stripeSubscription!.id ]);
                        if (res.success) {
                            refreshAvailableSubscriptions();
                            return {
                                success: true,
                                summary: 'Your mesh subscription will be cancelled at the end of the billing period.',
                                description: <>
                                    Your VeeaHubs will still have access to the software package until the end of the{' '}
                                    billing period, at which point it will be uninstalled automatically.
                                </>,
                            };
                        } else {
                            errorMessage = res.message;
                        }
                    }
                    return {
                        success: false,
                        summary: 'We couldn\'t downgrade your package.',
                        description: `There was an error ${errorMessage}`,
                    };
                },
            },
        ]}
        renderBtn={({ text, onClick, type }) =>
            <Button wide large onClick={onClick}
                className={style.btn}
                disabled={pkg === null}
                success={type === 'success' || type === 'default'}
                primary={type === 'primary'}
                error={type === 'error'}
            >{text}</Button>
        }
    >
        <h1>Unsubscribe</h1>
        <h2>Are you sure you want to unsubscribe from this service?</h2>
        <hr />
        <h2 className={style.description}>
            {isWhitelisted || isFree ? `Your subscription will be cancelled and the associated services will be removed from your VeeaHub immediately.`
            : `Your VeeaHubs will still have access to the software package until the end of the billing period,
            at which point it will be uninstalled automatically.`}
        </h2>
    </ActionModal>;
};

interface Props {
    manager: NodeState
    meshES: EnrollmentMeshState
    pkg: MeshPackageState
    open: boolean
    onClose: () => void
    refreshAvailableSubscriptions: () => void
    activeStripeSubscriptionsForMesh: StripeSubscriptionState[]
}
