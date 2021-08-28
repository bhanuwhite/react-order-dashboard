import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { StripeCardCvcElementChangeEvent, StripeCardExpiryElementChangeEvent, StripeCardNumberElementChangeEvent } from '@stripe/stripe-js';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { USPS_CODES } from '@/consts/us-states';
import { BillingAddress } from '@/actions/vtpn';
import { TextField } from '@/components/core/Inputs';
import { usePaymentDetailsFetcher } from '@/hooks/fetchers';
import { useStore } from '@/hooks/useStore';
import { Select, Spinner } from '@/components/core';
import * as styles from './index.module.scss';
import { CardState } from '@/store/domain/account';
import { useSelectFieldValidator, useTextFieldValidator } from '@/hooks/useValidator';
import { notEmptyValidator } from './validation';
import { useAnalyticsEvents } from '@/hooks/useAnalyticsEvents';
import { EVENT_CATEGORIES } from './consts';


// tslint:disable-next-line: variable-name
export const PaymentInfo: FC<Props> = observer(({
    country,
    submitted,
    onPaymentChange,
    setGetStripeToken,
    setCheckPaymentIsValid,
}) => {

    const store = useStore();
    const elements = useElements();
    const stripe = useStripe();
    const { sendAnalyticsEvent } = useAnalyticsEvents();

    const [ cardName, setCardName ] = React.useState('');

    const [ streetState, /* _ */, streetValidateNow ] = useTextFieldValidator(notEmptyValidator);
    const [ cityState, /* _ */, cityValidateNow ] = useTextFieldValidator(notEmptyValidator);
    const [ stateState, /* _ */, stateValidateNow ] = useSelectFieldValidator(notEmptyValidator);
    const [ zipState, /* _ */, zipValidateNow ] = useTextFieldValidator(notEmptyValidator);

    const [ error, setError ] = React.useState<string | null>(null);
    const [ cardValidated, setCardValidated ] = React.useState({
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false,
    });
    const cardNameRef = React.useRef<{ cardName: HTMLInputElement | null }>({ cardName: null });

    const isLoggedIn = store.view.activeuser.isLoggedIn;
    const defaultSource = store.domain.account.sources.defaultSource;
    const billingAddress = store.domain.account.billingAddress;

    const stripeElementStyle = { base: {
        fontFamily: 'Ubuntu',
        lineHeight: '17px',
    } };

    const { loading } = usePaymentDetailsFetcher({ isInvalid: !isLoggedIn });

    React.useEffect(() => {

        onPaymentChange(
            cardName !== '' ||
            streetState.value !== '' ||
            cityState.value !== '' ||
            stateState.value !== '' ||
            zipState.value !== '',
        );

    }, [ isLoggedIn, cardName, streetState.value, cityState.value, stateState.value, zipState.value ]);

    React.useEffect(() => {

        async function onSubmit(): Promise<Response> {

            // Has the user already provided a payment source
            if (isLoggedIn && defaultSource) {

                if (billingAddress) {
                    return {
                        stripeToken: undefined,
                        billingAddress: {
                            address_1: billingAddress.line1 ?? '',
                            address_2: billingAddress.line2,
                            city: billingAddress.city ?? '',
                            state: billingAddress.state ?? '',
                            zip: billingAddress.postal_code ?? '',
                            country,
                        },
                    };
                }

                return {
                    stripeToken: undefined,
                    billingAddress: {
                        address_1: streetState.value,
                        address_2: '',
                        city: cityState.value,
                        state: stateState.value,
                        zip: zipState.value,
                        country,
                    },
                };
            }

            const card = elements?.getElement(CardNumberElement);

            if (!card) {
                throw new Error('There was an error while adding your card. Please try again.');
            }

            const stripeRes = await stripe?.createToken(card, {
                name: cardName,
                address_line1: streetState.value,
                address_city: cityState.value,
                address_state: stateState.value,
                address_zip: zipState.value,
                address_country: country,
            });

            if (stripeRes?.error) {
                throw new Error(stripeRes.error.message ?? `
                    There was an error while adding your card. Please try again.
                `);
            }

            return {
                stripeToken: stripeRes?.token?.id,
                billingAddress: {
                    address_1: streetState.value,
                    address_2: '',
                    city: cityState.value,
                    state: stateState.value,
                    zip: zipState.value,
                    country,
                },
            };
        }

        async function checkPaymentIsValid(hasErrors?: boolean): Promise<boolean> {

            if (!defaultSource) {

                const nameContainsOnlyNumbers = ( /^\d+$/ ).test(cardName.trim());
                if (!cardName.trim() || nameContainsOnlyNumbers) {
                    if (!hasErrors) {
                        cardNameRef.current.cardName?.focus();
                        sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'validate_card_name_failed');
                    }
                    setError(nameContainsOnlyNumbers ? 'The name field must contain at least one letter.' : '');
                    hasErrors = true;
                }

                if (!cardValidated.cardNumber) {
                    if (!hasErrors) {
                        const el = elements?.getElement(CardNumberElement);
                        el?.focus();
                        sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'validate_card_number_failed');
                    }
                    hasErrors = true;
                }

                if (!cardValidated.cardExpiry) {
                    if (!hasErrors) {
                        const el = elements?.getElement(CardExpiryElement);
                        el?.focus();
                        sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'validate_card_expiration_failed');
                    }
                    hasErrors = true;
                }

                if (!cardValidated.cardCvc) {
                    if (!hasErrors) {
                        const el = elements?.getElement(CardCvcElement);
                        el?.focus();
                        sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'validate_card_cvc_failed');
                    }
                    hasErrors = true;
                }
            }

            if (!billingAddress) {

                const streetValidationResult = await streetValidateNow(!hasErrors);
                if (!hasErrors && !streetValidationResult) {
                    sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'validate_billing_street_failed');
                }
                hasErrors = !streetValidationResult || hasErrors;

                const cityValidationResult = await cityValidateNow(!hasErrors);
                if (!hasErrors && !cityValidationResult) {
                    sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'validate_billing_city_failed');
                }
                hasErrors = !cityValidationResult || hasErrors;

                const stateValidationResult = await stateValidateNow(!hasErrors);
                if (!hasErrors && !stateValidationResult) {
                    sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'validate_billing_state_failed');
                }
                hasErrors = !stateValidationResult || hasErrors;

                const zipValidationResult = await zipValidateNow(!hasErrors);
                if (!hasErrors && !zipValidationResult) {
                    sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'validate_billing_zip_failed');
                }
                hasErrors = !zipValidationResult || hasErrors;
            }

            return !hasErrors;
        }

        setCheckPaymentIsValid(checkPaymentIsValid);
        setGetStripeToken(onSubmit);

    }, [
        isLoggedIn,
        cardName,
        streetState.value,
        cityState.value,
        stateState.value,
        zipState.value,
        defaultSource,
        billingAddress,
        cardValidated,
    ]);

    function onCardChange(ev: StripeElementChangeEvent) {
        const validated = ev.complete && !ev.empty;
        if (cardValidated[ev.elementType] !== validated) {
            setCardValidated({
                ...cardValidated,
                [ev.elementType]: validated,
            });
        }
        if (ev.error) {
            setError(ev.error.message);
        } else {
            setError(null);
        }
    }

    if (!isLoggedIn || (!defaultSource && !loading)) {
        return <div className="bkg-grey-242 pt-15 mb-20 border rounded border-solid border-lighter-grey relative">
            <div className="pl-15 pr-15 mb-15">
                <TextField innerLabelAbove onChange={setCardName}
                    value={cardName}
                    className="w-full h-65 m-0"
                    label="Name on Card"
                    inputRef={el => cardNameRef.current.cardName = el}
                    invalid={submitted && !cardName}
                    autoComplete="cc-name" />
            </div>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-2/3 pl-15 pr-15 mb-10">
                    <CardNumberElement
                        className={`text-field cursor-text m-0 w-full pl-10 ${styles.stripeTextField}${submitted && !cardValidated.cardNumber ? ' invalid' : ''}`}
                        onChange={onCardChange} options={{
                            style: stripeElementStyle,
                            showIcon: true,
                        }} />
                </div>
                <div className="w-1/2 lg:w-1/6 pl-15 lg:pl-0 mb-10">
                    <CardExpiryElement
                        className={`text-field cursor-text m-0 w-full pl-10 ${styles.stripeTextField}${submitted && !cardValidated.cardExpiry ? ' invalid' : ''}`}
                        onChange={onCardChange} options={{
                            style: stripeElementStyle,
                        }} />
                </div>
                <div className="w-1/2 lg:w-1/6 pl-15 pr-15 mb-10">
                    <CardCvcElement
                        className={`text-field cursor-text m-0 w-full pl-10 ${styles.stripeTextField}${submitted && !cardValidated.cardCvc ? ' invalid' : ''}`}
                        onChange={onCardChange} options={{
                            style: stripeElementStyle,
                        }} />
                </div>
            </div>
            <div className="pl-15 pr-15 mb-15">
                <TextField innerLabelAbove
                    {...streetState}
                    className="w-full h-65 m-0"
                    label="Billing Address"
                    autoComplete="billing address-line1" />
            </div>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/3 pl-15 pr-15 lg:pr-0 mb-15">
                    <TextField innerLabelAbove
                        {...cityState}
                        className="w-full h-65 m-0"
                        label="City"
                        autoComplete="billing address-level2" />
                </div>
                <div className="w-1/2 lg:w-1/3 pl-15 mb-15">
                    <Select required innerLabelAbove
                        {...stateState}
                        className="w-full h-65 m-0"
                        label="State"
                        autoComplete="billing address-level1"
                    >
                        <option value="">Select a state...</option>
                        {USPS_CODES.map(([code, name]) =>
                            <option key={code} value={code}>{name}</option>,
                        )}
                    </Select>
                </div>
                <div className="w-1/2 lg:w-1/3 pl-15 pr-15 mb-15">
                    <TextField innerLabelAbove
                        {...zipState}
                        className="w-full h-65 m-0"
                        label="ZIP Code"
                        autoComplete="billing postal-code" />
                </div>
            </div>
            {error && <div className="pl-15 pr-15 mt-10 mb-5 text-center text-offline">{error}</div>}
        </div>;
    }

    if (!defaultSource) {
        return <Spinner text="Fetching your payment details..." />;
    }

    const defCard = defaultSource as CardState;
    const expMonth = defCard.exp_month < 10 ? `0${defCard.exp_month}` : defCard.exp_month;

    return <>
    <div className="bkg-grey-242 p-15 pb-0 mb-20 border rounded border-solid border-lighter-grey">
        <div className="border bkg-white border-solid rounded border-lighter-grey p-20 mb-15">
            <i className="icon-37_Card mr-5"/>
            <div className="font-bold font-size-16 inline-block capitalize">
                {defCard.brand}
            </div>
            <div className="font-size-16 font-thin ml-10 inline-block">···· {defCard.last4}</div>
            <div className="font-size-12 text-grey mt-5">
                Expiration: {expMonth} / {defCard.exp_year}
            </div>
        </div>
        {!billingAddress && <>
            {/* <h2 className="text-primary font-size-18 mb-15 mt-20">Billing Address</h2> */}
            <div className="mb-15">
                <TextField innerLabelAbove
                    {...streetState}
                    className="w-full h-65 m-0"
                    label="Billing Address"
                    autoComplete="billing address-line1" />
            </div>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/3 mb-15">
                    <TextField innerLabelAbove
                        {...cityState}
                        className="w-full h-65 m-0"
                        label="City"
                        autoComplete="billing address-level2" />
                </div>
                <div className="w-1/2 lg:w-1/3 lg:pl-15 mb-15">
                    <Select required innerLabelAbove
                        {...stateState}
                        className="w-full h-65 m-0"
                        label="State"
                        autoComplete="billing address-level1"
                    >
                        <option value="">Select a state...</option>
                        {USPS_CODES.map(([code, name]) =>
                            <option key={code} value={code}>{name}</option>,
                        )}
                    </Select>
                </div>
                <div className="w-1/2 lg:w-1/3 pl-15 mb-15s">
                    <TextField innerLabelAbove
                        {...zipState}
                        className="w-full h-65 m-0"
                        label="ZIP Code"
                        autoComplete="billing postal-code" />
                </div>
            </div>
        </>}
    </div>
    <div className="text-grey font-size-14 w-full">
        If this is not the payment method you would like to use, you can select a new one{' '}
        with the Manage Payments link above.
    </div>
    </>;
});

interface Response {
    stripeToken: string | undefined
    billingAddress: BillingAddress;
}

export type GetStripeToken = () => Promise<Response>;

export const defaultGetStripeToken: GetStripeToken = async () => {
    throw new Error('Stripe was not initialized correctly. Please try again later.');
};

interface Props {
    country: string
    submitted: boolean
    onPaymentChange(hasChanged: boolean): void
    setGetStripeToken(getStripeToken: GetStripeToken): void
    setCheckPaymentIsValid(checkPaymentIsValid: (hasErrors?: boolean) => Promise<boolean>): void
}

type StripeElementChangeEvent =
    StripeCardNumberElementChangeEvent | StripeCardExpiryElementChangeEvent | StripeCardCvcElementChangeEvent;
