import * as moment from 'moment';
import { Store } from '@/store';
import { FetcherInstance } from '../instance';
import { ordersStatusResponse, orderStatusResponse, OrderResponseType } from '@/schemas';
import { updateMapWithClass, updateOneEntryWithClass } from './helpers';
import { OrderProps, OrderState } from '@/store/domain/vff/orders';


export function handleVFFEndpoints(instance: FetcherInstance, store: Store) {

    // Obtains all orders
    instance.get('/vff/v1/orders/get/:keycloakID', async (req) => {
        const result = ordersStatusResponse.validate(req.body);
        if (result.type === 'error') {
            return result;
        }
        updateMapWithClass(store.domain.orders, OrderState, result.value, transformOrder);
    });

    // Obtain one order
    instance.get('/vff/v1/orders/get/order/:orderId', async (req) => {
        const result = orderStatusResponse.validate(req.body);
        if (result.type === 'error') {
            return result;
        }
        updateOneEntryWithClass(store.domain.orders.map, OrderState, transformOrder(result.value));
    });
}

function parseVFFDate(date: string) {
    const parsed = moment.default(date, 'MM/DD/YYYY hh:mm:ssA');
    if (parsed.isValid()) {
        return parsed;
    }
    return moment.default(date);
}

function parseVFFNullDate(date: string | null) {
    if (date === null) {
        return null;
    }
    return parseVFFDate(date);
}

function transformOrder(val: OrderResponseType): OrderProps & { id: string } {
    return {
        ...val,
        id: val.srid,
        status: val.items?.[0].internal_status ?? 'unknown',
        dateDelivered: parseVFFNullDate(val.items?.[0].date_delivered ?? null),
        created: parseVFFDate(val.date),
        cancelled: !!val.cancelled,
        children: val.items.map(child => ({
            ...child,
            status: child.internal_status,
            date_placed: parseVFFNullDate(child.date_placed),
            date_scheduled_delivery: parseVFFNullDate(child.date_scheduled_delivery),
            date_shipped: parseVFFNullDate(child.date_shipped),
            date_delivered: parseVFFNullDate(child.date_delivered),
        })),
    };
}