import * as React from 'react';
import { FC } from 'react';
import { AsyncValidateNow, FieldValidatorWithCallback } from '@/hooks/useValidator';
import { Autocomplete } from '@/components/core/Inputs';
import { Dictionary } from '@/utils/types';
import { ShippingAddress } from './index';

// tslint:disable-next-line: variable-name
export const StreetAddressInput: FC<StreetAddressInputProps> = ({
    setShippingAddressProp,
    addressState,
    addressValidateNow,
    fillSuggestedValues,
    suggestedAddresses,
    clearSuggested,
    className,
    label,
}) => {

    const [ suggestedDropdownOpen, setSuggestedDropdownOpen ] = React.useState(false);
    const onAddressInputChangeTimeoutRef = React.useRef(0);

    function onAddressInputChange(_ev: React.ChangeEvent<{}>, val: string, reason: string) {
        if (reason !== 'reset') {
            setShippingAddressProp?.('address', val);
            addressState.onChange(val);
        } else {
            clearTimeout(onAddressInputChangeTimeoutRef.current);
            onAddressInputChangeTimeoutRef.current = setTimeout(addressValidateNow);
        }
    }

    function onAutocompleteChange(
        _ev: React.ChangeEvent<{}>,
        value: Dictionary<'address' | 'city' | 'state' | 'zip', string> | string | null,
    ) {
        if (value && typeof value !== 'string') {
            fillSuggestedValues(value);
            setShippingAddressProp?.('address', value.address);
            setShippingAddressProp?.('city', value.city);
            setShippingAddressProp?.('state', value.state);
            setShippingAddressProp?.('zip', value.zip);
        }
    }

    function saveInputRef(ref: React.RefObject<HTMLInputElement>) {
        addressState.inputRef(ref.current);
    }

    React.useEffect(() => {
        if (suggestedAddresses.length > 0 && addressState.invalid) {
            setSuggestedDropdownOpen(true);
        }
    }, [ suggestedAddresses, addressState.invalid ]);

    return <Autocomplete
        freeSolo
        innerLabelAbove
        autoHighlight
        label={label}
        className={className}
        hideNoResultFound={true}
        saveInputRef={saveInputRef}
        invalid={addressState.invalid}
        inputValue={addressState.value}
        onChange={onAutocompleteChange}
        onInputChange={onAddressInputChange}
        options={suggestedAddresses}
        filterOptions={(options) => options}
        getOptionLabel={addr => `${addr.address}, ${addr.city}, ${addr.state}, ${addr.zip}`}
        open={suggestedDropdownOpen}
        onOpen={() => setSuggestedDropdownOpen(true)}
        onClose={() => {}}
        appendIcon={suggestedAddresses.length > 0 ? 'fas fa-times fa-lg cursor-pointer mt-30' : ''}
        onAppendIconClick={clearSuggested} />;
};

interface StreetAddressInputProps {
    setShippingAddressProp?: (propName: keyof ShippingAddress, newValue: string | number) => void
    addressState: FieldValidatorWithCallback<HTMLInputElement>
    addressValidateNow: AsyncValidateNow
    fillSuggestedValues: (suggestedValues: Dictionary<'address' | 'city' | 'state' | 'zip', string>) => void
    suggestedAddresses: Dictionary<'address' | 'city' | 'state' | 'zip', string>[]
    clearSuggested: () => void
    className?: string
    label: string
}