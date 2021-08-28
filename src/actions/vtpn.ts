import { DEFAULT_ADDRESS_VALUES } from '@/components/VTPN/PlaceOrder/consts';
import { updateOneEntryWithClass } from '@/fetcher/endpoints/helpers';
import { ignoreSchema, placeOrderResponse, validateShippingResponse } from '@/schemas';
import { Store } from '@/store';
import { AddressState } from '@/store/view/vtpn-order-form';
import { setProp, updateProps } from '@/utils/obj';
import { newIdGenerator } from '@/utils/uniqueId';
import { action } from 'mobx';
import { postJSONStdMasResponse, RequestResult } from './helpers';


/**
 * Cancel the order. This can only be done if the order
 * is marked as cancellable and cancelled.
 */
export function cancelOrder(
    store: Store,
    orderId: string,
): Promise<RequestResult<unknown>> {
    return postJSONStdMasResponse(store, `/vff/v1/orders/get/order/${orderId}/cancel`, undefined, ignoreSchema);
}

/**
 * Place order action
 *
 * stripeToken should be undefined if the user hasn't been asked
 * to provide a payment method because he already has one active.
 */
export async function vtpnPlaceOrder(
    store: Store,
    stripeToken: string | undefined,
    sku: string,
    veeahubs: VeeaHubDetails[],
    billingAddress: BillingAddress,
    user?: UserDetails,
): Promise<RequestResult<{ confirmationId: string }>> {
    const body = {
        user,
        veeahubs,
        stripeToken,
        sku,
        billingAddress,
    };

    const res = await postJSONStdMasResponse(store, '/vtpn/place-order', body, placeOrderResponse);
    if (res.success) {
        return res.response;
    }
    return res;
}

/**
 * onChange handler for shipping address form inputs
 * @param store
 * @param addressId
 */
export function onAddressInputChange(address: AddressState) {
    return (propName: keyof AddressState['props'], newValue: string | number) => {
        if (address) {
            action(() => {
                setProp(address.props, propName, newValue);
                if (propName !== 'qty' && propName !== 'recipient' && address.confirmed) {
                    address.confirmed = false;
                    address.modalPopped = false;
                }
            })();
        }
    };
}

/**
 * Remove a shipping address from the store
 * @param store
 * @param addressId
 */
export function deleteAddress(store: Store, addressId: string) {
    action(() => {
        store.view.vtpnOrderForm.addresses.map.delete(addressId);
    })();
}

/**
 * Add a new shipping address in the store with a unique ID
 * @param store
 * @param addressId
 */
export function createNewAddress(store: Store) {
    updateOneEntryWithClass(store.view.vtpnOrderForm.addresses.map, AddressState, {
        id: newIdGenerator('address')(),
        ...DEFAULT_ADDRESS_VALUES,
    });
}

/**
 * Remove all shipping addresses from the store
 * @param store
 */
export function clearAddresses(store: Store) {
    action(() => {
        store.view.vtpnOrderForm.addresses.map.clear();
    })();
}

/**
 * Query the UPS API for suggested addresses based on user input
 * @param store
 * @param addressId
 */
export async function validateAddress(store: Store, address: AddressState) {
    action(() => {
        address.modalPopped = true;
    })();
    const suggestedAddressResults = await validateAddressWithUPS(store, address);
    action(() => {
        address.suggestedResults = suggestedAddressResults;
    })();
}

/**
 * Clear the suggested address from UPS
 * @param address
 */
export function clearSuggestedResults(address: AddressState) {
    action(() => {
        address.suggestedResults = [];
    })();
}

/**
 * Used when the user confirms they either want to go with their original input
 * or with a suggested address from UPS
 * @param address
 */
export function confirmResults(address: AddressState) {
    action(() => {
        address.confirmed = true;
    })();
}

/**
 * Populate the shipping address card with values from the UPS suggested address
 * @param originalAddress
 * @param suggestedAddress
 */
export function populateAddressWithSuggested(
    originalAddress: AddressState,
    suggestedAddress: AddressState['props'],
) {
    action(() => {
        updateProps(originalAddress.props, suggestedAddress);
    })();
}

/**
 * Do a check on all the address inputs and mark invalid if empty
 * @param address
 */
export function setAllAddressInputsInvalid(address: AddressState) {
    action(() => {
        address.invalid.street = !address.props.street;
        address.invalid.city = !address.props.city;
        address.invalid.state = !address.props.state;
        address.invalid.zip = !address.props.zip;
    })();
}

/**
 * Set a single address input as invalid if the value is empty
 * @param address
 * @param propNam
 */
export function setAddressInputInvalid(address: AddressState, propName: keyof AddressState['props']) {
    action(() => {
        address.invalid[propName] = !address.props[propName];
    })();
}

/**
 * Call the UPS API and generate a list of suggested address results
 * @param store
 * @param address
 */
async function validateAddressWithUPS(store: Store, address: AddressState): Promise<AddressState['props'][]> {

    const res = await postJSONStdMasResponse(
        store,
        `/ups/validate-address`,
        {
            XAVRequest: {
                AddressKeyFormat: {
                    AddressLine: [ address.props.street ],
                    PoliticalDivision2: address.props.city,
                    PoliticalDivision1: address.props.state,
                    PostcodePrimaryLow: address.props.zip,
                    CountryCode: 'US',
                },
            },
        },
        validateShippingResponse,
    );

    if (res.success) {
        if (res.response.success) {
            if ('response' in res.response.response) {
                console.error(JSON.stringify(res.response.response.response.errors));
            } else {
                if ('AmbiguousAddressIndicator' in res.response.response.XAVResponse) {
                    const suggestedAddresses = normalizedSuggestedAdresses(res.response.response.XAVResponse.Candidate);
                    if (!valuesMatchOneSuggestedAddress(address.props, suggestedAddresses)) {
                        return suggestedAddresses;
                    } else {
                        action(() => {
                            address.confirmed = true;
                        })();
                    }
                }

                if ('ValidAddressIndicator' in res.response.response.XAVResponse) {
                    const suggestedAddresses = normalizedSuggestedAdresses([
                        res.response.response.XAVResponse.Candidate,
                    ]);
                    if (!valuesMatchOneSuggestedAddress(address.props, suggestedAddresses)) {
                        return suggestedAddresses;
                    } else {
                        action(() => {
                            address.confirmed = true;
                        })();
                    }
                }
            }
        } else {
            console.error(res.response.message);
        }
    } else {
        console.error(res.status, res.message);
    }
    return [];
}

/**
 * Massage the UPS address data to play nicely with our own AddressState
 *
 * Also, deduplicate the results. For some reason, this API will sometimes return a list of identical results.
 * I wish you the best of luck if you choose to inquire to UPS developer support on this issue.
 * May the force be with you.
 *
 * @param candidates
 */
function normalizedSuggestedAdresses(candidates: SuggestedAddressProps[]): AddressState['props'][] {
    const normalizedCandidates = candidates.map(({ AddressKeyFormat: suggestedAddress }) => ({
        street: typeof suggestedAddress.AddressLine === 'string'
            ? suggestedAddress.AddressLine
            : suggestedAddress.AddressLine.join(', '),
        city: suggestedAddress.PoliticalDivision2,
        state: suggestedAddress.PoliticalDivision1,
        zip: suggestedAddress.PostcodePrimaryLow,
    }));

    // dedupe
    return Array.from(new Set(normalizedCandidates.map(a => JSON.stringify(a)))).map(a => JSON.parse(a));
}

/**
 * Case insensitive matching function for addresses
 * @param values
 * @param suggestedAddresses
 */
function valuesMatchOneSuggestedAddress(
    values: AddressState['props'],
    suggestedAddresses: AddressState['props'][],
) {
    const valuesLowerCased = {
        street: lowerCaseTrim(values.street),
        city: lowerCaseTrim(values.city),
        state: lowerCaseTrim(values.state),
        zip: lowerCaseTrim(values.zip),
    };
    return !!suggestedAddresses.find(addr => (
        valuesLowerCased.street === lowerCaseTrim(addr.street) &&
        valuesLowerCased.city === lowerCaseTrim(addr.city) &&
        valuesLowerCased.state === lowerCaseTrim(addr.state) &&
        valuesLowerCased.zip === lowerCaseTrim(addr.zip)
    ));
}

/**
 * Lower case and trim a string
 * @param str
 */
function lowerCaseTrim(str: string) {
    return str.toLowerCase().trim();
}

interface SuggestedAddressProps {
    AddressKeyFormat: {
        AddressLine: string | string[]
        PoliticalDivision2: string,
        PoliticalDivision1: string,
        PostcodePrimaryLow: string,
    }
}

export interface VeeaHubDetails {
    shipTo: string
    address_1: string
    zip: string
    city: string
    state: string
}

interface UserDetails {
    email: string
    password: string
    firstName: string
    lastName: string
    company: string
    phoneNumber: string
    country: string
}

export interface BillingAddress {
    address_1: string
    address_2: string | null
    city: string
    state: string
    country: string
    zip: string
}