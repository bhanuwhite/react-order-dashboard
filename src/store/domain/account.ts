import { observable, ObservableMap } from 'mobx';


export type PaymentSourceState =
    CardState |
    AccountState |
    BankAccount;

export interface StripeSubscriptionState {
    id: string
    price: number
    node_serial: string | null
    package_id: string | null
    mesh_id: string | null
    mesh_uuid: string | null
    cancel_at_period_end: boolean,
    canceled_at: number | null,
    cancel_at: number | null,
    status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid',
}

export interface CardState {
    type: 'card'
    id: string
    default: boolean
    last4: string
    brand: string
    cardholder_name: string | null
    address_line1: string | null
    address_line2: string | null
    city: string | null
    zip_code: string | null
    state: string | null
    country: string | null
    exp_month: number
    exp_year: number
}

interface AccountState {
    type: 'account'
    id: string
    default: boolean
}

interface BankAccount {
    type: 'bank_account'
    id: string
    default: boolean
    last4: string
    bank_name: string
    account_holder_name: string
    account_holder_type: string
}


export interface DomainAccountState {
    /**
     * All payment method that the user has entered.
     */
    sources: {
        /**
         * Access all the payment sources as a map.
         */
        map: ObservableMap<string, PaymentSourceState>,
        /**
         * Returns all the payment sources as an array.
         */
        all: PaymentSourceState[],
        /**
         * Returns true if the user has at least
         * one payment card that isn't expired.
         *
         * This skips sources that aren't of type cards.
         */
        hasValidPaymentCard: boolean,
        /**
         * Returns the default source of the user if any
         * or null otherwise.
         */
        defaultSource: PaymentSourceState | null,
    },

    /**
     * All Stripe subscriptions for the user and asssociated Stripe customer
     */
    stripeSubscriptions: {
        /**
         * Access all the Stripe subscriptions as a map.
         */
        map: ObservableMap<string, StripeSubscriptionState>,
        /**
         * Returns all the Stripe subscriptions as an array.
         */
        all: StripeSubscriptionState[],
        /**
         * Returns all the Stripe subscriptions that aren't in
         * the "canceled" status
         */
        active: StripeSubscriptionState[],
    }

    billingAddress: {
        city: string | null,
        country: string | null,
        line1: string | null,
        line2: string | null,
        postal_code: string | null,
        state: string | null,
    } | null
}

export const createAccount = () => observable<DomainAccountState>({
    sources: {
        map: observable.map<string, PaymentSourceState>(),
        get all(): PaymentSourceState[] {
            return [...this.map.values()];
        },
        get hasValidPaymentCard(): boolean {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();

            return this.all.filter(src => {
                if (src.type === 'card') {
                    if (year > src.exp_year) {
                        return false;
                    }
                    if (year === src.exp_year) {
                        return month <= src.exp_month;
                    }
                    return true;
                }
                // Ignore sources that aren't cards
                return false;
            }).length > 0;
        },
        get defaultSource(): PaymentSourceState | null {
            for (const src of this.map.values()) {
                if (src.default) {
                    return src;
                }
            }
            return null;
        },
    },
    stripeSubscriptions: {
        map: observable.map<string, StripeSubscriptionState>(),
        get active(): StripeSubscriptionState[] {
            return this.all.filter(sub => sub.status !== 'canceled');
        },
        get all(): StripeSubscriptionState[] {
            return [...this.map.values()];
        },
    },
    billingAddress: null,
});