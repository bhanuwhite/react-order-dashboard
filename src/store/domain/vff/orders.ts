/**
 * vTPN Orders information
 */
import { Clock } from '@/store/clock';
import { computed, observable } from 'mobx';
import * as moment from 'moment';
import { HasFetcherProps, Value } from '../_helpers';


export interface OrderProps {
    /** odoo sales order id */
    osoid: string
    /** format [DD]/[MM]/[YYYY] [12hr Time] */
    created: moment.Moment
    /** SKU of the product bought */
    sku: SKUState
    /** Order status */
    status: 'create_order' | 'sent_to_ups' | 'received_eod' | 'unknown'
    /** Date order was delivered */
    dateDelivered: moment.Moment | null
    /** Whether the order can be cancelled (should be true only the first 15 minutes) */
    cancellable: boolean
    /** True if the order has been canceled */
    cancelled: boolean
    /** Sub orders */
    children: ShipmentState[]
}

export class OrderState implements HasFetcherProps<OrderProps> {

    /** srid of the order */
    readonly id: string;

    @observable
    props: OrderProps;

    /**
     * Return true if this order can be cancelled.
     */
    canBeCancelled(clock: Clock): boolean {
        // Check if the order was created more than 15 minutes ago.
        if (this.props.created.isBefore(moment.default(clock.minutes.get()).subtract(15, 'minutes'))) {
            return false;
        }
        return !this.props.cancelled && this.props.cancellable;
    }

    /**
     * Returns the derived status of the order
     */
    @computed
    get derivedStatus(): DerivedOrderStatus {
        if (this.props.cancelled) {
            return DerivedOrderStatus.Canceled;
        } else if (this.props.status !== 'received_eod') {
            return DerivedOrderStatus.Processing;
        } else {
            if (this.props.dateDelivered !== null) {
                return DerivedOrderStatus.Delivered;
            } else {
                return DerivedOrderStatus.Shipped;
            }
        }
    }

    /**
     * Returns true if at least one item in the order contains a UPS tracking code
     */
    @computed
    get hasAtLeastOneTrackingCode(): boolean {
        return this.props.children.some(c => c.fulfillment_tracking);
    }

    constructor(
        { id, ...props }: Value & OrderProps,
    ) {
        this.id = id;
        this.props = props;
    }
}

export interface SKUState {
    /** Id of this SKU */
    id: number
    /** Name of this SKU */
    name: string
    /** get started urlw */
    url_get_started: string | null
}

export interface ShipmentState {
    /** unique child order id */
    isrid: string
    /** Order status */
    status: 'create_order' | 'sent_to_ups' | 'received_eod'
    ship_to: string
    address_1: string
    address_2: string | null
    city: string
    state: string
    country: string
    zip: string
    fulfillment_res_pvc: string | null,
    fulfillment_res_serial: string | null,
    fulfillment_res_description: string | null,
    fulfillment_service_order: string | null,
    fulfillment_tracking: string | null,
    date_placed: moment.Moment | null
    date_scheduled_delivery: moment.Moment | null
    date_shipped: moment.Moment | null
    date_delivered: moment.Moment | null
}

export enum DerivedOrderStatus {
    Canceled,
    Processing,
    Shipped,
    Delivered,
}

export class OrdersState {

    readonly map = observable.map<string, OrderState>();

    @computed
    get all(): OrderState[] {
        return [...this.map.values()]
            .sort(compareOrders);
    }
}

export const createOrders = () => new OrdersState();

function compareOrders(a: OrderState, b: OrderState) {
    if (a.props.created.isAfter(b.props.created)) {
        return -1;
    }
    if (a.props.created.isBefore(b.props.created)) {
        return 1;
    }
    return 0;
}