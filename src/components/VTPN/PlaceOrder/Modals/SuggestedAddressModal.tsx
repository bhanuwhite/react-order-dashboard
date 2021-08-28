import * as React from 'react';
import { FC } from 'react';
import { Button, Modal } from '@/components/core';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { clearSuggestedResults, confirmResults, populateAddressWithSuggested } from '@/actions';
import { ShowMorePanel } from '@/components/core/ShowMorePanel';


// tslint:disable-next-line: variable-name
export const SuggestedAddressModal: FC<SuggestedAddressModalProps> = observer(({ addressId, onClose }) => {

    const store = useStore();
    const [ open, setOpen ] = React.useState(false);
    const addressState = store.view.vtpnOrderForm.addresses.map.get(addressId);

    const originalAddressString = JSON.stringify(addressState?.props);
    const [ addressSelection, setAddressSelection ] = React.useState('');

    React.useEffect(() => {
        const hasSuggestedResults = !!addressState && addressState?.suggestedResults.length > 0;
        setOpen(hasSuggestedResults);
        setAddressSelection(originalAddressString);
    }, [ addressState?.suggestedResults ]);

    function onConfirmClick() {
        if (addressState) {
            if (addressSelection !== originalAddressString) {
                const confirmedSuggestedAddress = addressState.suggestedResults[Number(addressSelection)];
                if (confirmedSuggestedAddress) {
                    populateAddressWithSuggested(addressState, confirmedSuggestedAddress);
                }
            }
            clearSuggestedResults(addressState);
            confirmResults(addressState);
        }
        onClose();
        setOpen(false);
    }

    const suggestedResults = addressState?.suggestedResults.map((addr, i) => {
        const suggestedAddressString = JSON.stringify(addr);
        return <div key={i} className={`cursor-pointer mt-10 border rounded border-solid border-lighter-grey w-full${(
                addressSelection === `${i}` ? ' border-info border-4 pt-10 pb-10' : ''
            )}`}
            onClick={() => setAddressSelection(`${i}`)}
            style={{ ...(addressSelection !== `${i}` && { padding: '13px 3px' })}}>
            <input type="radio" id={`suggested-address-${i}`} name="address-selection" className="opacity-0 absolute cursor-pointer"
                value={suggestedAddressString}
                onChange={() => {}}
                checked={addressSelection === `${i}`} />
            <label htmlFor={`suggested-address-${i}`}
                className="font-size-18 font-bold ml-20 cursor-pointer">
                Suggested Address #{i + 1}
                <div className="ml-20 font-size-14 font-normal">{Object.values(addr ?? []).join(', ')}</div>
            </label>
        </div>;
    }) ?? null;

    const shippingAddressIndex = store.view.vtpnOrderForm.addresses.all.findIndex(a => a.id === addressId);

    return <Modal extended open={open} noClose className="max-w-11/12" innerClassName="pt-20">
        <div className="text-primary font-size-18 mb-10">Please verify the shipping address</div>
        <div className="font-light font-size-18 text-grey mb-20">
            To ensure accurate delivery please consider our suggested addresses
        </div>
        <form>
            <div className="font-size-14 ml-5 pb-5 pt-10 font-bold">
                Shipping Address #{shippingAddressIndex + 1}
            </div>
            <div className={`cursor-pointer mt-10 border rounded border-solid border-lighter-grey w-full${(
                    addressSelection === originalAddressString ? ' border-info border-4 pt-10 pb-10' : ''
                )}`}
                onClick={() => setAddressSelection(originalAddressString)}
                style={{ ...(addressSelection !== originalAddressString && { padding: '13px 3px' })}}>
                <OriginalAddressInput addressSelection={addressSelection}
                    originalAddressString={originalAddressString} />
                <label htmlFor="original-address" className="font-size-18 font-bold ml-20 cursor-pointer">
                    Original Address
                    <div className="ml-20 font-size-14 font-normal">
                        {[
                            addressState?.props.street,
                            addressState?.props.city,
                            addressState?.props.state,
                            addressState?.props.zip,
                        ].join(', ')}
                    </div>
                </label>
            </div>
            <hr />
            {suggestedResults && suggestedResults.length >= 3 ? <>
                <ShowMorePanel defaultValue={false} startingHeight={270}
                    qtyRemainingItems={suggestedResults.length - 3}>
                    {suggestedResults}
                </ShowMorePanel>
            </> : suggestedResults}
            <br />
            <div className="flex justify-end mt-10">
                <Button info
                    type="button"
                    onClick={onConfirmClick}>
                    Confirm Address
                </Button>
            </div>
        </form>
    </Modal>;
});

// tslint:disable-next-line: variable-name
const OriginalAddressInput: FC<{ addressSelection: string, originalAddressString: string }> = ({
    addressSelection,
    originalAddressString,
}) => {
    const originalAddressInputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        originalAddressInputRef.current?.focus();
    }, [ originalAddressInputRef ]);

    return <input ref={originalAddressInputRef} type="radio" id="original-address" name="address-selection" className="opacity-0 absolute cursor-pointer"
        value={originalAddressString}
        onChange={() => {}}
        checked={addressSelection === originalAddressString}
    />;
};

interface SuggestedAddressModalProps {
    addressId: string
    onClose: () => void
}