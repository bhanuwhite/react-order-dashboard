import { newValidator, Obj, Arr, Nullable, Enum, STRING, BOOL, NUMBER, TypeOf } from 'typesafe-schema';


const orderDefinition = Obj({
    srid: STRING,
    osoid: STRING,
    date: STRING,
    sku: Obj({
        id: NUMBER,
        name: STRING,
        url_get_started: Nullable(STRING),
    }),
    cancellable: BOOL,
    cancelled: NUMBER,
    items: Arr(Obj({
        isrid: STRING,
        ship_to: STRING,
        address_1: STRING,
        address_2: Nullable(STRING),
        city: STRING,
        state: STRING,
        country: STRING,
        zip: STRING,
        internal_status: Enum('create_order', 'sent_to_ups', 'received_eod'),
        fulfillment_res_pvc: Nullable(STRING),
        fulfillment_res_serial: Nullable(STRING),
        fulfillment_res_description: Nullable(STRING),
        fulfillment_service_order: Nullable(STRING),
        fulfillment_tracking: Nullable(STRING),
        date_placed: Nullable(STRING),
        date_scheduled_delivery: Nullable(STRING),
        date_shipped: Nullable(STRING),
        date_delivered: Nullable(STRING),
    })),
});

export type OrderResponseType = TypeOf<typeof orderDefinition>;

// Response for /vff/v1/orders/get/order/:orderId
export const orderStatusResponse = newValidator(orderDefinition);

// Response for /vff/v1/orders/get/:keycloakID
export const ordersStatusResponse = newValidator(Arr(orderDefinition));

// Error schema for vff
export const vffErrorSchema = newValidator(Obj({ error: STRING }));