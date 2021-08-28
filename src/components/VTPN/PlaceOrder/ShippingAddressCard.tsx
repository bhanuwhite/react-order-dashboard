import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { USPS_CODES } from '@/consts/us-states';
import { TextField } from '@/components/core/Inputs';
import { Select } from '@/components/core';
import * as styles from './index.module.scss';
import { useStore } from '@/hooks/useStore';
import { AsyncValidateNow, ValidateNow } from '@/hooks/useValidator';
import {
    onAddressInputChange as onAddressInputChangeAction,
    setAddressInputInvalid,
    setAllAddressInputsInvalid,
    validateAddress,
} from '@/actions';
import { Dictionary } from '@/utils/types';
import { AddressState } from '@/store/view/vtpn-order-form';
import { defaultObjFrom } from '@/utils/object-helpers';
import { DEFAULT_ADDRESS_VALUES } from './consts';

const elementsThatShouldTriggerModalOnClick = [
    'input',
    'label',
    'button',
    'select',
];

// tslint:disable-next-line: variable-name
export const ShippingAddressCard: FC<ShippingAddressCardProps> = observer(({
    remainingFulfillableDevices,
    totalVeeaHubOrderCount,
    numShippingAddresses,
    setShippingAddressValidators,
    setAddressIdToValidate,
    deleteVeeaHub,
    shippingAddress,
    i,
}) => {

    const store = useStore();

    const onAddressChange = onAddressInputChangeAction(shippingAddress);
    const shippingAddressBlockRef = React.useRef<HTMLDivElement | null>(null);
    const addressInputRefs = React.useRef<
        Dictionary<keyof AddressState['props'], HTMLInputElement | HTMLSelectElement | null>
    >(defaultObjFrom(DEFAULT_ADDRESS_VALUES, null));

    function addressRequiredValidateNow(focusOnError?: boolean): boolean {
        if (
            !shippingAddress.props.street || !shippingAddress.props.city ||
            !shippingAddress.props.state || !shippingAddress.props.zip
        ) {
            if (focusOnError) {
                const focusProp = !shippingAddress.props.street
                ? 'street' : !shippingAddress.props.city
                ? 'city' : !shippingAddress.props.state
                ? 'state' : 'zip';
                addressInputRefs.current[focusProp]?.focus();
            }
            setAllAddressInputsInvalid(shippingAddress);
            return false;
        }
        return true;
    }

    function recipientRequiredValidateNow(focusOnError?: boolean): boolean {
        if (!shippingAddress.props.recipient) {
            if (focusOnError) {
                addressInputRefs.current.recipient?.focus();
            }
            setAddressInputInvalid(shippingAddress, 'recipient');
            return false;
        }
        return true;
    }

    function qtyValidateNow(focusOnError?: boolean): boolean {
        if (totalVeeaHubOrderCount > remainingFulfillableDevices || shippingAddress.props.qty < 1) {
            if (focusOnError) {
                addressInputRefs.current.qty?.focus();
            }
            return false;
        }
        return true;
    }

    function onAddressInputFocusOut(propName: keyof AddressState['props']) {
        return () => {
            if (shippingAddress) {
                setAddressInputInvalid(shippingAddress, propName);
            }
        };
    }

    function onZipChange(val: string) {
        onAddressChange('zip', val);
        // In most cases the suggested address modal can be displayed after
        // the user finishes typing the 5th character of the zip
        if (
            shippingAddress.props.street
            && shippingAddress.props.city
            && shippingAddress.props.state
            && val.length === 5
        ) {
            setAddressIdToValidate(shippingAddress.id);
            validateAddress(store, shippingAddress);
        }
    }

    React.useEffect(() => {
        setShippingAddressValidators([
            recipientRequiredValidateNow,
            qtyValidateNow,
            addressRequiredValidateNow,
        ]);
    });

    React.useEffect(() => {
        function listener(e: MouseEvent) {
            const nodeName = (e.target as HTMLElement).nodeName;
            const hasTriggerModalProp = (e.target as HTMLElement).dataset.hasOwnProperty('triggerModal');
            const isSubmitButton = (e.target as HTMLElement).getAttribute('type') === 'submit';
            const isElementThatShouldTriggerModal = elementsThatShouldTriggerModalOnClick
                .includes(nodeName.toLowerCase());
            const isClickInside = shippingAddressBlockRef.current?.contains(e.target as Node);
            const addressIsFullyPopulated = shippingAddress.props.street && shippingAddress.props.city
                && shippingAddress.props.state && shippingAddress.props.zip;

            // if the user clicks outside of the shipping address div and the form is complete, validate with UPS
            if (!isClickInside && !shippingAddress.modalPopped && addressIsFullyPopulated && !isSubmitButton &&
                (hasTriggerModalProp || isElementThatShouldTriggerModal)) {
                setAddressIdToValidate(shippingAddress.id);
                validateAddress(store, shippingAddress);
            }
        }

        document.addEventListener('click', listener);
        return () => document.removeEventListener('click', listener);
    }, [
        shippingAddressBlockRef,
        shippingAddress.modalPopped,
        shippingAddress.props.street,
        shippingAddress.props.city,
        shippingAddress.props.state,
        shippingAddress.props.zip,
    ]);

    return <div ref={shippingAddressBlockRef} className="bkg-grey-242 pt-15 mb-20 border rounded border-solid border-lighter-grey relative">
        {numShippingAddresses > 1 && <i className="fas fa-times-circle font-size-24 absolute text-primary -right-10 -top-10 hover:text-primary-light cursor-pointer" onClick={deleteVeeaHub} />}
        <div className="ml-20 mr-20 flex">
            <div className="w-3/5 lg:w-3/4 mb-10 mr-25 font-bold">Shipping Address #{i + 1}</div>
            <div className="w-2/5 lg:w-1/4 lg:pl-5 font-size-14 text-grey flex items-center justify-center">
                <div>Quantity</div>
            </div>
        </div>
        <div className="flex mb-15">
            <div className="w-3/5 lg:w-3/4 pl-15 pr-15">
                <TextField innerLabelAbove
                    value={shippingAddress.props.recipient}
                    inputRef={(el) => addressInputRefs.current.recipient = el}
                    onChange={(val) => onAddressChange('recipient', val)}
                    onFocusOut={onAddressInputFocusOut('recipient')}
                    invalid={shippingAddress.invalid.recipient}
                    className="w-full h-65 m-0"
                    label="Recipient's name"
                    autoComplete="shipping name" />
            </div>
            <div className="w-2/5 lg:w-1/4 pr-15">
                <TextField innerLabelAbove className={`w-full h-65 m-0 ${styles.incrementedNumberInput}`}
                    onChange={(val) => onAddressChange('qty', Number(val))}
                    value={`${shippingAddress.props.qty}`}
                    prependIcon={`fas fa-minus-circle font-size-20 ${
                        shippingAddress.props.qty <= 1 ? 'text-transparent' : 'text-info cursor-pointer'
                    }`}
                    onPrependIconClick={shippingAddress.props.qty <= 1
                        ? undefined
                        : () => onAddressChange('qty', shippingAddress.props.qty > 1
                            ? shippingAddress.props.qty - 1
                            : 1 )}
                    appendIcon={`fas fa-plus-circle font-size-20 ${
                        remainingFulfillableDevices <= totalVeeaHubOrderCount ? 'text-transparent' : 'text-info cursor-pointer'
                    }`}
                    onAppendIconClick={remainingFulfillableDevices > totalVeeaHubOrderCount
                            ? () => onAddressChange('qty', shippingAddress.props.qty + 1)
                            : undefined}
                    type="number"
                    min={1}
                    max={shippingAddress.props.qty + remainingFulfillableDevices - totalVeeaHubOrderCount}
                    inputRef={el => addressInputRefs.current.qty = el}
                    invalid={shippingAddress.props.qty < 1 || totalVeeaHubOrderCount > remainingFulfillableDevices} />
            </div>
        </div>
        {totalVeeaHubOrderCount > remainingFulfillableDevices && <div className="font-size-14 text-center text-offline mt-5 mb-10">
            This quantity is unavailable now, please try a smaller quantity
        </div>}
        <div className="flex mb-15 pl-15 pr-15">
            <TextField innerLabelAbove
                value={shippingAddress.props.street}
                inputRef={(el) => addressInputRefs.current.street = el}
                onChange={(val) => onAddressChange('street', val)}
                onFocusOut={onAddressInputFocusOut('street')}
                invalid={shippingAddress.invalid.street}
                className="w-full h-65 m-0"
                label="Shipping Address"
                autoComplete="shipping address-line1" />
        </div>
        <div className="flex flex-wrap">
            <div className="w-full lg:w-1/3 pl-15 pr-15 lg:pr-0 mb-15">
                <TextField innerLabelAbove
                    value={shippingAddress.props.city}
                    inputRef={(el) => addressInputRefs.current.city = el}
                    onChange={(val) => onAddressChange('city', val)}
                    onFocusOut={onAddressInputFocusOut('city')}
                    invalid={shippingAddress.invalid.city}
                    className="w-full h-65 m-0"
                    label="City"
                    autoComplete="shipping address-level2" />
            </div>
            <div className="w-1/2 lg:w-1/3 pl-15 mb-15">
                <Select innerLabelAbove
                    value={shippingAddress.props.state}
                    inputRef={(el) => addressInputRefs.current.state = el}
                    onChange={(val) => onAddressChange('state', val)}
                    onFocusOut={onAddressInputFocusOut('state')}
                    invalid={shippingAddress.invalid.state}
                    className="w-full h-65 m-0"
                    label="State"
                    required
                    autoComplete="shipping address-level1">
                    <option value="">Select a state...</option>
                    {USPS_CODES.map(([code, name]) =>
                        <option key={code} value={code}>{name}</option>,
                    )}
                </Select>
            </div>
            <div className="w-1/2 lg:w-1/3 pl-15 pr-15 mb-15">
                <TextField innerLabelAbove
                    value={shippingAddress.props.zip}
                    inputRef={(el) => addressInputRefs.current.zip = el}
                    onChange={onZipChange}
                    onFocusOut={onAddressInputFocusOut('zip')}
                    invalid={shippingAddress.invalid.zip}
                    className="w-full h-65 m-0"
                    label="ZIP Code"
                    autoComplete="shipping postal-code" />
            </div>
        </div>
        {shippingAddress.confirmed && <div className="ml-20 mb-15 font-size-14 text-success">
            Verified <i className="fas fa-check ml-5 font-size-14"></i>
        </div>}
    </div>;
});

interface ShippingAddressCardProps {
    setShippingAddressValidators: (validators: (ValidateNow | AsyncValidateNow)[]) => void
    setAddressIdToValidate: (val: string) => void
    remainingFulfillableDevices: number
    shippingAddress: AddressState
    totalVeeaHubOrderCount: number
    numShippingAddresses: number
    deleteVeeaHub: () => void
    i: number
}