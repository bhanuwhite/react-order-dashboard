import * as React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Container } from '../Container';
import { useVFFOrdersFetcher } from '@/hooks/fetchers/vff-endpoints';
import { useRedirectIfNotLoggedIn } from '@/hooks/useRedirectIfNotLoggedIn';
import { HeadTitle, Spinner } from '@/components/core';
import { ErrorBox } from '@/components/core/Errors';
import { OrderItem } from './OrderItem';
import { observer } from 'mobx-react-lite';
import { Questions } from '../Questions';
import { cancelOrder } from '@/actions';
import { CancelConfirmModal } from './Modals/CancelConfirmModal';


// tslint:disable-next-line: variable-name
export const MyOrders: FC<Props> = observer(({}) => {

    const store = useStore();
    const { loading, error, fetchNow } = useVFFOrdersFetcher(store);
    const [ cancelConfirmModalOpen, setCancelConfirmModalOpen ] = React.useState(false);
    const [ orderIdToCancel, setOrderIdToCancel ] = React.useState<string>('');

    const orders = store.domain.orders.all;
    const noOrders = orders.length === 0;

    useRedirectIfNotLoggedIn(store);

    async function onCancelClick(orderId: string) {
        setOrderIdToCancel(orderId);
        setCancelConfirmModalOpen(true);
    }

    async function onConfirmCancel() {
        const res = await cancelOrder(store, orderIdToCancel ?? '');
        if (res.success) {
            await fetchNow();
            return {
                success: true,
                description: 'Cancel successful',
            };
        } else {
            console.error(res.message, res.status);
            return {
                success: false,
                summary: 'Unable to cancel order',
                description: res.message,
            };
        }
    }

    return <>
    <HeadTitle>Veea - vTPN - My Orders</HeadTitle>
    <CancelConfirmModal open={cancelConfirmModalOpen}
        onClose={() => setCancelConfirmModalOpen(false)}
        run={onConfirmCancel}>
            Are you sure you want to cancel order <b>{orderIdToCancel}</b>?
    </CancelConfirmModal>
    <div className="bkg-grey-242">
        <Container className="pb-45 pt-45 pb-0 flex flex-col justify-center">
            <div className="text-primary font-size-20 mb-10 font-bold">My Orders</div>
            <div className="font-light font-size-20">
                Check the status of your orders
            </div>
        </Container>
    </div>
    <Container className="mt-30 flex flex-col lg:flex-row">
        <div className="flex-grow mb-30 lg:mr-100">
            {noOrders && loading ? <Spinner /> :
                noOrders && error ? <ErrorBox>{error.message}</ErrorBox> :
                noOrders ? <NoOrderFound /> :
                <>
                    <div className="rounded border border-solid border-lighter-grey bkg-grey-249 p-20 mb-20 flex">
                        <i className="icon-39_Information block mr-15 font-size-24" />
                        <div style={{ paddingTop: '3px' }}>
                            <h2 className="mb-5 font-size-16 font-bold">Manage your subscriptions</h2>
                            You can cancel a subscription of a VeeaHub by opening the order details
                        </div>
                    </div>
                    {orders.map(order =>
                        <OrderItem key={order.id} order={order} onCancelClick={() => onCancelClick(order.id)} />,
                    )}
                </>
            }
        </div>
        <div className="w-full lg:w-450 flex-shrink-0">
            <div className="bkg-grey-242 p-30 mb-20">
                <div className="text-primary font-size-18 mb-20">
                    Hello, {store.view.activeuser.firstName || 'Unknown user'}!
                </div>
                <Link to="/" className="block text-info no-underline hover:underline font-bold p-5 pl-0">
                    Place new order
                </Link>
                <a href={`/account/change-password?redirectPath=${encodeURIComponent('/#/my-orders/')}`} className="block text-info no-underline hover:underline font-bold p-5 pl-0">
                    Change password
                </a>
                <a href="/logout" className="block text-info no-underline hover:underline font-bold p-5 pl-0">
                    Log out
                </a>
            </div>
            <Questions />
        </div>
    </Container>
    </>;
});

interface Props {}

// tslint:disable-next-line: variable-name
const NoOrderFound: FC<{}> = () => (
    <div>
        We couldn't find any previous orders.
        You can <Link to="/" className="text-primary">place a new order.</Link>
    </div>
);