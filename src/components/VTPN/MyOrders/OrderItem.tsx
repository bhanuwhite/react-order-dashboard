import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { DerivedOrderStatus, OrderState } from '@/store/domain/vff/orders';
import { Link } from 'react-router-dom';
import { bkgStatus, formatStatus, trackOrderLink } from './helpers';
import { useStore } from '@/hooks/useStore';


// tslint:disable-next-line: variable-name
export const OrderItem: FC<Props> = observer(({ order, onCancelClick }) => {
    const store = useStore();

    return <div className="rounded border border-solid border-lighter-grey bkg-grey-249 p-20 mb-20">
        <div className="flex justify-between">
            <div>
                <h2 className="mb-15 font-size-16 font-bold">Order on {order.props.created.format('MMMM Do, YYYY')}</h2>
                <OrderStatus derivedStatus={order.derivedStatus} />
            </div>
            <div className="flex justify-between flex-col items-end">
                <Link to={`/my-orders/${order.id}/`} className="text-info no-underline hover:underline font-bold font-size-14">
                    View order details
                </Link>
                {order.hasAtLeastOneTrackingCode &&
                    <a href={trackOrderLink(order)} rel="noreferrer" className="text-info no-underline hover:underline font-bold font-size-14">
                        Track my order
                    </a>
                }
                {order.canBeCancelled(store.clock) && <div onClick={onCancelClick}
                        title="You can cancel the order the first 15 minutes after having placed your order"
                        className="cursor-pointer text-info hover:underline font-bold font-size-14"
                    >
                        Cancel
                </div>}
            </div>
        </div>
        <hr />
        {
            order.derivedStatus === DerivedOrderStatus.Delivered && <>
                <div className="font-thin font-size-14 mb-5">
                    Your order has been delivered.
                </div>
                {order.props.sku.url_get_started &&
                    <a href={order.props.sku.url_get_started} target="_blank" className="text-info no-underline hover:underline font-bold font-size-14">
                        Learn how to get started with vTPN
                    </a>
                }
                <hr className="border-2" />
            </>
        }
        <div className="font-thin font-size-14 mb-10">
            {order.props.children.length} x VeeaHub with {order.props.sku.name}
        </div>
        <div className="font-thin font-size-14">
            Reference ID: {order.id}
        </div>
    </div>;
});

interface Props {
    order: OrderState
    onCancelClick(): void
}

// tslint:disable-next-line: variable-name
const OrderStatus: FC<{ derivedStatus: DerivedOrderStatus }> = ({ derivedStatus }) => (
    <div className="font-thin" style={{ fontSize: '15px' }}>
        <div className={`inline-block align-text-bottom mr-15 w-15 h-15 ${bkgStatus(derivedStatus)}`} />
        {formatStatus(derivedStatus)}
    </div>
);