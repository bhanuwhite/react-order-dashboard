import * as React from 'react';
import { FC } from 'react';
import { Modal, Button, Checkbox, Spinner } from '@/components/core';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { TextField } from '@/components/core/Inputs';
import { stripeCountryCodes } from '@/consts/stripe-country-codes';
import * as style from './index.module.scss';
import { addCard } from '@/actions';
import { useStore } from '@/hooks/useStore';


/**
 * Modal to offer the opportunity to the user to add a card.
 */
// tslint:disable-next-line: variable-name
export const AddPaymentCardModal: FC<Props> = ({ open, confirmText, onClose }) => (
    <Modal open={open} onClose={onClose} centered extended>
        <AddPaymentCardBody onCardSuccessfullyAdded={onClose} confirmText={confirmText} />
    </Modal>
);

interface Props {
    /**
     * Set to true if the modal should be opened.
     */
    open: boolean

    /**
     * Called when the modal should be closed.
     */
    onClose(): void

    /**
     * Set a custom confirm text. By default it's set to 'Continue'
     */
    confirmText?: string
}

/**
 * Body component used by the `AddPaymentCardModal`.
 * This component is useful to embed the payment card modal body
 * as part of another modal flow, such as subscription when
 * the user hasn't have added a card yet.
 */
// tslint:disable-next-line: variable-name
export const AddPaymentCardBody: FC<BodyProps> = ({ onCardSuccessfullyAdded, confirmText }) => {

    const [state, setState] = React.useState<LocalState>('idle');
    const [error, setError] = React.useState<string | null>(null);
    // tslint:disable: variable-name
    const [name, setName] = React.useState('');
    const [address_line1, setAddressLine1] = React.useState('');
    const [address_line2, setAddressLine2] = React.useState<string | undefined>('');
    const [address_city, setAddressCity] = React.useState<string | undefined>(undefined);
    const [address_country, setAddressCountry] = React.useState<string>(stripeCountryCodes[0].code);
    const [cardWillBeDefault, setCardWillBeDefault] = React.useState(true);
    // tslint:enable: variable-name
    const stripe = useStripe();
    const elements = useElements();
    const store = useStore();

    function onCardChange(ev: StripeCardElementChangeEvent) {
        if (ev.error) {
            setError(ev.error.message);
        } else {
            setError(null);
        }
    }

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setState('pending');

        if (!stripe || !elements) {
            setState('idle');
            return;
        }

        const card = elements.getElement('card');

        if (!card) {
            setError('There was an error while adding your card. Please try again.');
            setState('idle');
            return;
        }

        const nameContainsOnlyNumbers = ( /^\d+$/ ).test(name.trim());
        if (!name.trim() || nameContainsOnlyNumbers) {
            setError('The name field must contain at least one letter.');
            setState('idle');
            return;
        }

        const res = await stripe.createToken(card, {
            name,
            address_line1,
            address_line2,
            address_city,
            address_country,
        });

        const err = res.error;
        const token = res.token;

        if (err) {
            console.error(err);
            const devopErr = `${err.code ?? 'No code'} / ${err.decline_code ?? 'No decline code'} / ${err.charge ?? 'No ID failed charged'}`;
            setError(err.message ?? `There was an error adding your card: ${err.type} (${devopErr})`);
            setState('idle');
            return;
        }

        if (!token) {
            setError('Operation was cancelled');
            setState('idle');
            return;
        }

        try {
            const addCardResp = await addCard(store, token.id, cardWillBeDefault);
            if (!addCardResp.success) {
                setError(`Failed to add card: ${addCardResp.message}`);
                setState('idle');
                return;
            }
            onCardSuccessfullyAdded();
        } catch (err) {
            err = err instanceof Error ? err.message : `${err}`;
            setError(err);
            setState('idle');
        }
    }

    return <>
        <h1>Add Card</h1>
        <h2>You can make this card the default for subscriptions.</h2>
        {error ?
            <div className={style.errorField}>{error}</div> :
            null
        }
        <form onSubmit={handleSubmit}>
            <TextField required className={style.field} value={name} onChange={v => setName(v)}
                label={<>Cardholder Name <span className={style.fieldEmph}>(required)</span></>}
            />
            <CardElement className="text-field" onChange={onCardChange} options={{
                style: {
                    base: {
                        fontFamily: 'Ubuntu',
                    },
                },
            }} />
            <TextField required className={style.field} value={address_line1} onChange={v => setAddressLine1(v)}
                label={<>Billing Address - Line 1 <span className={style.fieldEmph}>(required)</span></>}
            />
            <div className={`${style.field} ${style.groupedFields}`}>
                <TextField className={style.halfSpace} value={address_line2 ?? ''} onChange={v => setAddressLine2(v)}
                    label={<>Billing Address - Line 2 <span className={style.fieldEmph}>(optional)</span></>}
                />
                <TextField value={address_city ?? ''} onChange={v => setAddressCity(v)}
                    label={<>City <span className={style.fieldEmph}>(optional)</span></>}
                />
                <select className={`text-field ${style.country}`}
                    onChange={(ev) => setAddressCountry(ev.target.selectedOptions[0].value)}
                >
                    {stripeCountryCodes.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
            </div>
            <Checkbox className={style.field} checked={cardWillBeDefault}
                onClick={() => setCardWillBeDefault(!cardWillBeDefault)}
            >
                Use this card by default for future payments.
            </Checkbox>
            <div className={style.upgradeDisclosure}>
                By clicking Continue, you authorize your card to be saved on file for future payments.{' '}
                You can edit or delete your saved cards from the Control Center.
            </div>
            <Button disabled={state === 'pending'} large success wide className={style.continueBtn}>
                {state === 'pending' ? <Spinner /> : (confirmText ?? 'Continue')}
            </Button>
        </form>
    </>;
};

interface BodyProps {
    /**
     * Called when the card was successfully added.
     */
    onCardSuccessfullyAdded(): void

    /**
     * Set a custom confirm text. By default it's set to 'Continue'
     */
    confirmText?: string
}

type LocalState = 'idle' | 'pending';