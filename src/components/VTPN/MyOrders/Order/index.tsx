import * as React from 'react';
import { FC } from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { useRedirectIfNotLoggedIn } from '@/hooks/useRedirectIfNotLoggedIn';
import { useVFFOrderFetcher } from '@/hooks/fetchers/vff-endpoints';
import { LinkButton, Spinner, HeadTitle } from '@/components/core';
import { ErrorBox } from '@/components/core/Errors';
import { ShipmentState } from '@/store/domain/vff/orders';
import { bkgStatus, formatStatus, trackOrderLink } from '../helpers';
import { Container } from '../../Container';
import { Questions } from '../../Questions';
import { useAllSubscriptionsFetcher } from '@/hooks/fetchers';
import { Store } from '@/store';
import { StripeSubscriptionState } from '@/store/domain/account';
import { CancelConfirmModal } from '../Modals/CancelConfirmModal';
import { cancelSubscription } from '@/actions/subscriptions';
import { useScrollToTop } from '@/hooks/useScrollToTop';


// tslint:disable-next-line: variable-name
export const Order: FC<{}> = observer(({}) => {

    const store = useStore();
    const { orderId } = useParams<{ orderId?: string }>();
    const { loading, error } = useVFFOrderFetcher(orderId);
    const [ unitSerialToCancel, setUnitSerialToCancel ] = React.useState('');
    const [ subscriptionIdsToCancel, setSubscriptionIdsToCancel ] = React.useState<string[]>([]);
    const [ cancelConfirmModalOpen, setCancelConfirmModalOpen ] = React.useState(false);

    const order = store.domain.orders.map.get(orderId ?? '');
    const derivedStatus = order?.derivedStatus;
    const hasAtLeastOneTrackingCode = !!order?.hasAtLeastOneTrackingCode;
    const stripeSubscriptions = store.domain.account.stripeSubscriptions.all;

    useAllSubscriptionsFetcher();
    useRedirectIfNotLoggedIn(store);
    useScrollToTop();

    function findSubscriptionsForNodeSerial(nodeSerial: string) {
        return stripeSubscriptions.filter(sub => nodeSerial && sub.node_serial === nodeSerial);
    }

    function findCancelableSubscriptions(nodeSerial: string) {
        return findSubscriptionsForNodeSerial(nodeSerial)
            .filter(({ status, canceled_at, cancel_at_period_end, cancel_at }) =>
                status !== 'canceled' && !cancel_at_period_end && !canceled_at && !cancel_at);
    }

    function checkSubscriptionsAreCanceled(nodeSerial: string) {
        const subscriptions = findSubscriptionsForNodeSerial(nodeSerial);
        return subscriptions.length > 0 && subscriptions.every(({ canceled_at, cancel_at_period_end, cancel_at }) =>
            cancel_at_period_end || canceled_at || cancel_at,
        );
    }

    function onCancel(unitSerial: string, subscriptionIds: string[]) {
        setUnitSerialToCancel(unitSerial);
        setSubscriptionIdsToCancel(subscriptionIds);
        setCancelConfirmModalOpen(true);
    }

    async function cancelVeeaHubAction() {
        const res = await cancelSubscription(store, subscriptionIdsToCancel);
        if (res.success) {
            return {
                success: true,
                description: 'Cancel successful',
            };
        } else {
            return {
                success: false,
                summary: 'Unable to cancel',
                description: `There was an error ${res.message}`,
            };
        }
    }

    return <>
    <CancelConfirmModal open={cancelConfirmModalOpen}
        onClose={() => setCancelConfirmModalOpen(false)}
        run={cancelVeeaHubAction}>
            Are you sure you want to cancel for VeeaHub <b>{unitSerialToCancel}</b>?
    </CancelConfirmModal>
    <HeadTitle>Veea - vTPN - Order #{orderId ?? ''}</HeadTitle>
    <div className="bkg-grey-242">
        <Container className="pb-45 pt-45 pb-0 flex flex-col justify-center">
            <div className="text-primary font-size-20 mb-10 font-bold">Order #{orderId}</div>
            <div className={`font-light font-size-20${!order ? ' bkg-black opacity-10 rounded w-full sm:w-400' : ''}`}>
                Details about your order on {order?.props.created.format('MMMM Do, YYYY') ?? ''}
            </div>
        </Container>
    </div>
    <Container className="mt-30 flex flex-col lg:flex-row">
        <div className="flex-grow mb-30 lg:mr-100">
            {!order && loading && <Spinner />}
            {!order && error && <ErrorBox>{error.message}</ErrorBox>}
            {order && <>
                <div className="mb-30">
                    <h2 className="mb-20 font-bold font-size-16 text-primary">Status</h2>
                    <div className="mb-10">
                        <div className={`inline-block relative top-1 mr-10 w-15 h-15 ${bkgStatus(derivedStatus!)}`} />
                        {formatStatus(derivedStatus!)}
                    </div>
                    {hasAtLeastOneTrackingCode && <p className="font-thin font-size-14">
                        You can track your order on <a href={trackOrderLink(order)} rel="noreferrer" className="text-primary no-underline hover:underline">UPS</a>
                    </p>}
                </div>
                <div className="mb-30">
                    <h2 className="mb-20 font-bold font-size-16 text-primary">Order details</h2>
                    <p className="mb-10 font-thin">
                        {/* tslint:disable-next-line: max-line-length */}
                        <b>Order items:</b> {order.props.children.length} x VeeaHub{order.props.children.length > 1 ? 's' : ''} with {order.props.sku.name}
                    </p>
                    <p className="font-thin">
                        <b>Reference ID:</b> {order.id}
                    </p>
                </div>
                <div className="mb-30">
                    <h2 className="mb-20 font-bold font-size-16 text-primary">VeeaHubs</h2>
                    {order.props.children.map((unit, i) => <UnitOrdered
                        key={i} index={i} store={store} unit={unit} onCancel={onCancel}
                        checkSubscriptionsAreCanceled={checkSubscriptionsAreCanceled}
                        findCancelableSubscriptions={findCancelableSubscriptions}
                    />)}
                </div>
                <LinkButton small info to="/my-orders/" className="w-150">
                    View my orders
                </LinkButton>
            </>}
        </div>
        <div className="w-full lg:w-450 flex-shrink-0">
            <Questions />
        </div>
    </Container>
    </>;
});

// tslint:disable-next-line: variable-name
const UnitOrdered: FC<UnitOrderedProps> = ({
    unit,
    index,
    onCancel,
    findCancelableSubscriptions,
    checkSubscriptionsAreCanceled,
}) => {
    const shippingAddress = [ unit.address_1, unit.city, unit.state, unit.zip, unit.country ]
        .filter(a => a)
        .join(', ');
    const isAlreadyCanceled = unit.fulfillment_res_serial && checkSubscriptionsAreCanceled(unit.fulfillment_res_serial);
    const cancelableSubscriptions = findCancelableSubscriptions(unit.fulfillment_res_serial ?? '');
    const isCancelable = !!unit.date_delivered && unit.fulfillment_res_serial && cancelableSubscriptions.length > 0;

    return <div className="mb-10 bkg-grey-249 w-1/3 p-20 mr-10 border border-solid border-lighter-grey rounded w-full font-thin">
        <div className="flex justify-between">
            <h2 className="font-size-18 font-bold mb-30">VeeaHub #{index + 1}</h2>
            {isCancelable && <div className="cursor-pointer text-info hover:underline font-bold font-size-14"
                onClick={() => onCancel(unit.fulfillment_res_serial!, cancelableSubscriptions.map(s => s.id))}>
                Cancel
            </div>}
            {isAlreadyCanceled && <div className="text-primary font-bold">CANCELED</div>}
        </div>
        <div className="mb-15 flex">
            <div className="w-1/2">
                <b>Serial Number:</b> {unit.fulfillment_res_serial ??
                    <span className="italic text-grey">Unknown</span>
                }
            </div>
            <div className="w-1/2">
                <b>Service Order:</b> {unit.fulfillment_service_order ??
                    <span className="italic text-grey">Unknown</span>
                }
            </div>
        </div>
        <div className="mb-15 flex">
            <div className="w-1/2">
                <b>Shipping date:</b> {unit.date_shipped?.format('MMMM Do, YYYY') ??
                    <span className="italic text-grey">Not shipped yet</span>
                }
            </div>
            <div className="w-1/2">
                <b>Delivery date:</b> {unit.date_delivered?.format('MMMM Do, YYYY') ??
                    <span className="italic text-grey">Not delivered yet</span>
                }
            </div>
        </div>
        <div className="mb-10">
            <b>Shipping Address:</b> {shippingAddress}
        </div>
    </div>;
};

interface UnitOrderedProps {
    unit: ShipmentState,
    index: number,
    store: Store,
    onCancel: (unitSerial: string, subscriptionIds: string[]) => void
    findCancelableSubscriptions(nodeSerial: string): StripeSubscriptionState[]
    checkSubscriptionsAreCanceled(nodeSerial: string): boolean
}