import { defaultObjFrom } from '@/utils/object-helpers';
import { Dictionary } from '@/utils/types';
import { ObservableMap, observable } from 'mobx';
import { HasFetcherProps, Value } from '../domain/_helpers';

interface AddressProps {
    qty: number
    recipient: string
    street: string
    city: string
    state: string
    zip: string
}

export class AddressState implements HasFetcherProps<AddressProps> {

    readonly id: string;

    @observable
    props: AddressProps;

    @observable
    invalid: Dictionary<keyof AddressProps, boolean>;

    @observable
    suggestedResults: AddressProps[];

    @observable
    modalPopped: boolean;

    @observable
    confirmed: boolean;

    constructor(
        { id, ...props }: Value & AddressProps,
    ) {
        this.id = id;
        this.props = props;
        this.confirmed = false;
        this.modalPopped = false;
        this.invalid = defaultObjFrom(props, false);
        this.suggestedResults = [];
    }
}

export interface VtpnOrderFormState {
    addresses: {
        /**
         * Access all the addresses as a map.
         */
        map: ObservableMap<string, AddressState>,
        /**
         * Returns all the addresses as an array.
         */
        all: AddressState[],
    },
}

export const createVtpnOrderForm = () => observable<VtpnOrderFormState>({
    addresses: {
        map: observable.map<string, AddressState>(),
        get all(): AddressState[] {
            return [...this.map.values()];
        },
    },
});