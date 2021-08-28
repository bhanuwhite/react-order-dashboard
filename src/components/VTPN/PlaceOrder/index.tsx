import * as React from 'react';
import { FC, RefObject } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useHistory, Prompt } from 'react-router-dom';
import { PlaceOrderResponseModal } from './Modals/PlaceOrderResponseModal';
import { useFulfillableDevicesFetcher, useKeycloakMinPasswordLengthFetcher } from '@/hooks/fetchers';
import { stripeCountryCodes } from '@/consts/stripe-country-codes';
import { EVENT_CATEGORIES, VTPN_4G_PRICE, VTPN_BASE_PRICE } from './consts';
import { TextField } from '@/components/core/Inputs';
import { Button, HeadTitle, Select } from '@/components/core';
import { SideBarContent } from './SideBarContent';
import { useStore } from '@/hooks/useStore';
import { AsyncValidateNow, useManyFieldValidator, useTextFieldValidator, ValidateNow } from '@/hooks/useValidator';
import { clearAddresses, createNewAddress, deleteAddress, VeeaHubDetails, vtpnPlaceOrder } from '@/actions';
import { Container } from '../Container';
import { useBrowserPrompt } from '@/hooks/useBrowserPrompt';
import { OrderConfirmation } from './OrderConfirmation';
import {
    emailValidator,
    notEmptyValidator,
    phoneValidator,
    pwdValidator,
} from './validation';
import { PaymentInfo, defaultGetStripeToken } from './PaymentInfo';
import { useAnalyticsEvents } from '@/hooks/useAnalyticsEvents';
import { SuggestedAddressModal } from './Modals/SuggestedAddressModal';
import { ShippingAddressCard } from './ShippingAddressCard';

// tslint:disable-next-line: variable-name
export const PlaceOrder: FC<{}> = observer(() => {

    const store = useStore();

    const [ loginRegisterOption, setLoginRegisterOption ] = React.useState(LoginRegisterOption.Register);
    const [ emailState, emailValidationError, emailValidateNow ] = useTextFieldValidator(emailValidator);
    const [
        { password: passwordState, confirmPassword: confirmPasswordState },
        passwordValidationError,
        passwordValidateNow,
    ] = useManyFieldValidator(
        { password: '', confirmPassword: '' },
        pwdValidator(store.view.realm.minPasswordLength || 8),
        { validateOnFocusOut: true },
    );
    const [ firstNameState, /* _ */, firstNameValidateNow ] = useTextFieldValidator(notEmptyValidator);
    const [ lastNameState, /* _ */, lastNameValidateNow ] = useTextFieldValidator(notEmptyValidator);
    const [ company, setCompany ] = React.useState('');
    // Default value for this use case should always be US
    const [ country, setCountry ] = React.useState('US' as const);
    const [ phoneState, phoneValidationError, phoneValidateNow ] = useTextFieldValidator(phoneValidator(country));
    const [ packageSelection, setPackageSelection ] = React.useState(PackageSelection.vTPN4G);
    const [ agreeVtpnTerms, setAgreeVtpnTerms ] = React.useState(false);
    const [ addressIdToValidate, setAddressIdToValidate ] = React.useState('');
    const [ placeOrderModalOpen, setPlaceOrderModalOpen ] = React.useState(false);
    const [ placeOrderLoading, setPlaceOrderLoading ] = React.useState(false);
    const [ placeOrderError, setPlaceOrderError ] = React.useState('');
    const [ submitDisabled, setSubmitDisabled ] = React.useState(false);
    const [ submitted, setSubmitted ] = React.useState(false);
    const [ confirmationId, setConfirmationId ] = React.useState('');
    const [ paymentWasChanged, setPaymentWasChanged ] = React.useState(false);
    const [ getStripeToken, setGetStripeToken ] = React.useState(() => defaultGetStripeToken);
    const [ checkPaymentIsValid, setCheckPaymentIsValid ] = React.useState(() => async (_hasErrors?: boolean) => false);
    const shippingAddresses = store.view.vtpnOrderForm.addresses.all;

    // If the user has entered any of those fields then we prompt them
    // before they leave the page. If none of those fields specifically
    // have changed we let them navigating away without prompting them.
    const formWasChanged = LoginRegisterOption.Register ?
        (
            emailState.value !== '' ||
            passwordState.value !== '' ||
            firstNameState.value !== '' ||
            lastNameState.value !== '' ||
            company !== '' ||
            phoneState.value !== '' ||
            paymentWasChanged ||
            shippingAddresses.some(p =>
                p.props.street !== '' ||
                p.props.city !== '' ||
                p.props.recipient !== '' ||
                p.props.state !== '' ||
                p.props.zip !== '',
            )
        ) : (
            paymentWasChanged ||
            shippingAddresses.some(p =>
                p.props.street !== '' ||
                p.props.city !== '' ||
                p.props.recipient !== '' ||
                p.props.state !== '' ||
                p.props.zip !== '',
            )
        );

    const orderSubmittedSuccessfully = placeOrderModalOpen && !placeOrderLoading && !placeOrderError;

    useKeycloakMinPasswordLengthFetcher();
    useFulfillableDevicesFetcher([ window.VFF_VTPN_SKU , window.VFF_VTPN_4G_SKU ]);

    const { sendAnalyticsEvent } = useAnalyticsEvents();

    const history = useHistory();
    const location = history.location;

    const packageSKU = packageSelection === PackageSelection.vTPN
            ? window.VFF_VTPN_SKU
            : window.VFF_VTPN_4G_SKU;

    const remainingFulfillableDevices = store.domain.inventory.map.get(packageSKU ?? '')?.qty
        ?? Number.POSITIVE_INFINITY;

    const agreeVtpnTermsRef = React.useRef<{ agreeVtpnTerms: HTMLInputElement | null }>({ agreeVtpnTerms: null });
    const shippingAddressValidatorRefs = React.useRef(new Map<string, (ValidateNow | AsyncValidateNow)[]>());
    const submitRef = React.useRef<HTMLInputElement>(null);

    const totalVeeaHubOrderCount = shippingAddresses.reduce((res, address) => res + address.props.qty, 0);
    const outOfStock = remainingFulfillableDevices === 0;

    function setShippingAddressValidators(addressId: string) {
        return (validators: (ValidateNow | AsyncValidateNow)[]) => {
            shippingAddressValidatorRefs.current.set(addressId, validators);
        };
    }

    function deleteShippingAddress(addressId: string) {
        return () => {
            deleteAddress(store, addressId);
            shippingAddressValidatorRefs.current.delete(addressId);
        };
    }

    function addShippingAddress(e: React.MouseEvent<any, MouseEvent>) {
        e.preventDefault();
        setSubmitted(false);
        createNewAddress(store);
    }

    async function checkFormIsValidated(): Promise<boolean> {

        const validators: [ eventName: string, validateNow: ValidateNow | AsyncValidateNow ][] = [];
        if (!store.view.activeuser.isLoggedIn) {
            validators.push(
                [ 'validate_email', emailValidateNow ],
                [ 'validate_password', passwordValidateNow ],
                [ 'validate_first_name', firstNameValidateNow ],
                [ 'validate_last_name', lastNameValidateNow ],
                [ 'validate_phone', phoneValidateNow ],
            );
        }

        const shippingAddressValidators = Array.from(shippingAddressValidatorRefs.current.values())
            .reduce((res, val) => {
                const validatorsWithEventNames = val.map<typeof validators[0]>((validator, i) => [
                    `validate_${i === 0 ? 'recipient' : i === 1 ? 'qty' : 'shipping_address'}`,
                    validator,
                ]);
                return [ ...res, ...validatorsWithEventNames ];
            }, [] as typeof validators);

        validators.push(...shippingAddressValidators);

        let hasErrors = false;
        for (const [ eventName, validator ] of validators) {
            const validationResult: boolean = await validator(!hasErrors);
            if (!hasErrors && !validationResult) {
                sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, `${eventName}_failed`);
            }
            hasErrors = !validationResult || hasErrors;
        }

        hasErrors = !(await checkPaymentIsValid(hasErrors)) || hasErrors;

        if (!agreeVtpnTermsRef.current.agreeVtpnTerms?.checked) {
            if (!hasErrors) {
                agreeVtpnTermsRef.current.agreeVtpnTerms?.reportValidity();
                sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'validate_agree_terms_failed');
            }
            hasErrors = true;
        }

        return !hasErrors;
    }

    async function onSubmitOrder(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'submit_form');

        setSubmitted(true);
        setSubmitDisabled(true);

        if (!(await checkFormIsValidated())) {
            setSubmitDisabled(false);
            return;
        }

        setPlaceOrderLoading(true);
        setPlaceOrderModalOpen(true);

        const user = {
            email: emailState.value,
            password: passwordState.value,
            firstName: firstNameState.value,
            lastName: lastNameState.value,
            company,
            phoneNumber: phoneState.value,
            country,
        };

        const veeahubPayload = shippingAddresses.reduce((acc, { props: {
            recipient, street, zip, city, state, qty,
        } }) => {
            const vhOrderSpec = { shipTo: recipient, address_1: street, zip, city, state };
            for (let i = 0; i < qty; i++) {
                acc.push(vhOrderSpec);
            }
            return acc;
        }, [] as VeeaHubDetails[]);

        try {
            const { stripeToken, billingAddress } = await getStripeToken();
            const res = await vtpnPlaceOrder(
                store,
                stripeToken,
                // If packageSKU is undefined, then the backend is unavailable.
                packageSKU ?? 'service-unavaible',
                veeahubPayload,
                billingAddress,
                store.view.activeuser.isLoggedIn ? undefined : user,
            );

            sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, `place_order_${res.success ? 'success' : 'failed'}`);

            displayPlaceOrderError(!res.success ? res.message : '');

            if (res.success) {
                setConfirmationId(res.response.confirmationId);
                window.scrollTo(0, 0);
                setPlaceOrderModalOpen(false);
                setSubmitDisabled(false);
            }
        } catch (err) {
            sendAnalyticsEvent(EVENT_CATEGORIES.FORM_SUBMISSION, 'place_order_failed');
            displayPlaceOrderError(err.message);
        }
    }

    function displayPlaceOrderError(errorMessage: string) {
        setPlaceOrderError(errorMessage);
        setPlaceOrderLoading(false);
    }

    React.useEffect(() => {
        if (loginRegisterOption === LoginRegisterOption.Login) {
            window.location.href = `/login/?prevLocation=${location.pathname}`;
        }
    }, [ loginRegisterOption ]);

    // Only ask use to leave page if the user has modified any field.
    useBrowserPrompt(formWasChanged && !confirmationId);

    React.useEffect(() => {
        // create first shipping address
        createNewAddress(store);

        // Make sure to reset the login / register radio input
        // in case the user navigates away and then hits the back button
        // (Firefox, at least, will persist your previous radio selection)
        function beforeUnload() {
            setLoginRegisterOption(LoginRegisterOption.Register);
        }
        window.addEventListener('beforeunload', beforeUnload);
        return () => {
            // remove all shipping addresses if user navigates away
            clearAddresses(store);
            window.removeEventListener('beforeunload', beforeUnload);
        };
    }, []);

    return <>
        <HeadTitle>Veea - vTPN - Place Order</HeadTitle>
        <Prompt
            when={formWasChanged && !orderSubmittedSuccessfully && !confirmationId}
            message="Are you sure you want to leave? This form has been modified and any changes will be lost."
        />
        <PlaceOrderResponseModal open={placeOrderModalOpen}
            errorMessage={placeOrderError}
            loading={placeOrderLoading}
            onClose={() => {
                setPlaceOrderModalOpen(false);
                setSubmitDisabled(false);
                setPlaceOrderError('');
            }} />
        {!confirmationId &&
            <SuggestedAddressModal addressId={addressIdToValidate} onClose={() => setAddressIdToValidate('')} />}
        <div className="bkg-grey-242">
            <Container className="pb-45 pt-45 pb-0 flex flex-col justify-center">
                <div className="text-primary font-size-20 mb-10 font-bold">Start your Free 30-day Trial</div>
                <div className="font-light font-size-20">
                    Gain data protection and peace-of-mind with the vTPN Security Service. 30-day trial is{' '}
                    completely free - with no hidden charges.
                </div>
            </Container>
        </div>
        <Container className="mt-30 flex flex-col lg:flex-row">
            <div className="flex-grow lg:mr-100">
                {confirmationId ? <OrderConfirmation confirmationId={confirmationId} />
                : outOfStock ? <OutOfStock /> : <>
                    <form noValidate className="flex flex-col" onSubmit={onSubmitOrder}>
                        <div className="text-primary font-size-18 mb-10">Veea Account</div>
                        {store.view.activeuser.isLoggedIn ? <div className="flex justify-between">
                            <div className="font-light font-size-18 text-grey">
                                Welcome back, {store.view.activeuser.firstName || 'Unknown user'}!
                            </div>
                            <div>
                                {/* tslint:disable-next-line: max-line-length */}
                                <Link to="/my-orders" className="text-info no-underline hover:underline font-bold p-5 mr-30">
                                    My Orders
                                </Link>
                                <a href="/logout" className="text-info no-underline hover:underline font-bold p-5">
                                    Logout
                                </a>
                            </div>
                        </div> : <>
                            <div className="font-light font-size-18 text-grey mb-20">
                                Log in or create your free Veea account
                            </div>
                            <div className="cursor-pointer hover:underline self-start"
                                onChange={() => setLoginRegisterOption(LoginRegisterOption.Register)}>
                                <input id="register" type="radio"
                                    value={LoginRegisterOption.Register}
                                    onChange={() => {}}
                                    checked={loginRegisterOption === LoginRegisterOption.Register} />
                                <label htmlFor="register" className="pl-15 cursor-pointer font-bold">
                                    I don't have a Veea account
                                </label>
                            </div>
                            {loginRegisterOption === LoginRegisterOption.Register && <div className="flex flex-col mt-15 ml-35">
                                <div className="flex mb-15">
                                    <div className="w-full lg:w-1/3 lg:pr-15">
                                        <TextField innerLabelAbove className="w-full h-65 m-0"
                                            {...emailState}
                                            label="E-mail address"
                                            type="email"
                                            autoComplete="email"
                                        />
                                        {emailValidationError && <div className="font-size-14 text-center text-offline mt-5">
                                            {emailValidationError}
                                        </div>}
                                    </div>
                                    {/* tslint:disable-next-line: max-line-length */}
                                    <div className="hidden lg:flex lg:w-2/3 bkg-grey-242 pl-15 h-65 rounded font-size-14 text-grey items-center">
                                        This will be your login for Veea services
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-1/3 lg:pr-15 mb-15">
                                        <TextField innerLabelAbove className="w-full h-65 m-0"
                                            {...passwordState}
                                            label="Password"
                                            type="password"
                                            autoComplete="new-password"
                                        />
                                        {passwordValidationError.password && <div className="font-size-14 text-center text-offline mt-5">
                                            {passwordValidationError.password}
                                        </div>}
                                    </div>
                                    <div className="lg:w-1/3 lg:pr-15 mb-15">
                                        <TextField innerLabelAbove className="w-full h-65 m-0"
                                            {...confirmPasswordState}
                                            label="Confirm Password"
                                            type="password"
                                            autoComplete="new-password"
                                        />
                                        {passwordValidationError.confirmPassword && <div className="font-size-14 text-center text-offline mt-5">
                                            {passwordValidationError.confirmPassword}
                                        </div>}
                                    </div>
                                    {/* tslint:disable-next-line: max-line-length */}
                                    <div className="hidden lg:flex lg:w-1/3 bkg-grey-242 mb-15 pl-15 h-65 rounded font-size-14 text-grey items-center">
                                        At least {store.view.realm.minPasswordLength || 8} characters
                                    </div>
                                </div>
                                <hr className="w-full mt-5 mb-20" />
                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-1/3 lg:pr-15 mb-15">
                                        <TextField innerLabelAbove className="w-full h-65 m-0"
                                            {...firstNameState}
                                            label="First Name"
                                            autoComplete="given-name"
                                        />
                                        {/* tslint:disable-next-line: max-line-length */}
                                        {/* {firstNameError && <div className="font-size-14 text-center text-offline mt-5">
                                            {firstNameError}
                                        </div>} */}
                                    </div>
                                    <div className="lg:w-1/3 lg:pr-15 mb-15">
                                        <TextField innerLabelAbove className="w-full h-65 m-0"
                                            {...lastNameState}
                                            label="Last Name"
                                            autoComplete="family-name"
                                        />
                                        {/* tslint:disable-next-line: max-line-length */}
                                        {/* {lastNameError && <div className="font-size-14 text-center text-offline mt-5">
                                            {lastNameError}
                                        </div>} */}
                                    </div>
                                </div>
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-1/3 lg:pr-15 mb-15">
                                        <TextField innerLabelAbove className="w-full h-65"
                                            value={company}
                                            onChange={setCompany}
                                            label={<>
                                                Company
                                                <span className="ml-10 italic text-light-grey">(optional)</span></>
                                            } />
                                    </div>
                                    <div className="w-3/5 lg:w-1/3 pr-15 mb-15">
                                        <TextField innerLabelAbove className="w-full h-65"
                                            {...phoneState}
                                            label="Phone Number"
                                            autoComplete="tel"
                                        />
                                        {phoneValidationError && <div className="font-size-14 text-center text-offline mt-5">
                                            {phoneValidationError}
                                        </div>}
                                    </div>
                                    <div className="w-2/5 lg:w-1/3 mb-15">
                                        <Select disabled value={country} label="Country" innerLabelAbove
                                            onChange={setCountry}
                                            className="w-full h-65">
                                            {stripeCountryCodes.map((c) =>
                                                <option key={c.code} value={c.code}>{c.name}</option>,
                                            )}
                                        </Select>
                                    </div>
                                </div>
                            </div>}
                            <div className="cursor-pointer hover:underline mt-15 self-start"
                                onChange={() => setLoginRegisterOption(LoginRegisterOption.Login)}>
                                <input type="radio" id="login"
                                    value={LoginRegisterOption.Login}
                                    onChange={() => {}}
                                    checked={loginRegisterOption === LoginRegisterOption.Login} />
                                <label htmlFor="login" className="cursor-pointer pl-15 font-bold">
                                    I already have a Veea account
                                </label>
                            </div>
                        </>}
                        <hr className="w-full mt-30 mb-30" />
                        <div className="text-primary font-size-18 mb-10">Choose Package</div>
                        <div data-trigger-modal className={`cursor-pointer mt-10 border rounded border-solid border-lighter-grey w-full${(
                                packageSelection === PackageSelection.vTPN4G ? ' border-info border-4' : ''
                            )}`}
                            onClick={() => setPackageSelection(PackageSelection.vTPN4G)}
                            style={{ ...(packageSelection !== PackageSelection.vTPN4G && { padding: 3 })}}>
                            <div data-trigger-modal className="flex flex-wrap mt-15">
                                <div data-trigger-modal>
                                    <input type="radio" id="vtpn-4g-package" name="pkg-selection" className="opacity-0 absolute cursor-pointer"
                                        value={PackageSelection.vTPN4G}
                                        onChange={() => {}}
                                        checked={packageSelection === PackageSelection.vTPN4G} />
                                    <label htmlFor="vtpn-4g-package"
                                        className="font-size-18 font-bold ml-20 cursor-pointer">
                                        vTPN + 4G LTE Wireless WAN
                                    </label>
                                </div>
                                <div data-trigger-modal className="flex-grow text-right mt-5 lg:mt-0 mr-20">
                                    ${(VTPN_4G_PRICE * totalVeeaHubOrderCount).toFixed(2)}/mo
                                </div>
                            </div>
                            <div data-trigger-modal className="text-grey ml-20 mt-10 mb-15 pr-15">
                                Includes a single-location vTPN Security Service license, a VeeaHub Smart Edge Node{' '}
                                with 4G LTE Wireless WAN capability, and unlimited Wireless WAN data which may be used{' '}
                                for full-time wireless broadband or as a wired broadband backup/failover solution.
                            </div>
                        </div>
                        <div data-trigger-modal className={`cursor-pointer mt-10 border rounded border-solid border-lighter-grey w-full${(
                                packageSelection === PackageSelection.vTPN ? ' border-info border-4' : ''
                            )}`}
                            onClick={() => setPackageSelection(PackageSelection.vTPN)}
                            style={{ ...(packageSelection !== PackageSelection.vTPN && { padding: 3 })}}>
                            <div data-trigger-modal className="flex justify-between mt-15">
                                <div data-trigger-modal>
                                    <input type="radio" id="vtpn-package" name="pkg-selection" className="opacity-0 absolute cursor-pointer"
                                        value={PackageSelection.vTPN}
                                        onChange={() => {}}
                                        checked={packageSelection === PackageSelection.vTPN} />
                                    <label htmlFor="vtpn-package"
                                        className="font-size-18 font-bold ml-20 cursor-pointer">
                                        vTPN
                                    </label>
                                </div>
                                <div data-trigger-modal className="mr-20">
                                    ${(VTPN_BASE_PRICE * totalVeeaHubOrderCount).toFixed(2)}/mo
                                </div>
                            </div>
                            <div data-trigger-modal className="text-grey ml-20 mt-10 mb-15 pr-15">
                                Includes a single-location vTPN Security Service license and a VeeaHub Smart Edge Node.{' '}
                                Connects to your existing broadband modem.
                            </div>
                        </div>
                        <hr className="w-full mt-30 mb-30" />
                        <div className="text-primary font-size-18 mb-10">Shipping Address{shippingAddresses.length > 1 ? 'es' : ''}</div>
                        <div className="font-light font-size-18 text-grey mb-20">
                            For maximum convenience, if you need to ship to multiple locations, simply add a shipping{' '}
                            address for each user. If you specify a single address, all VeeaHubs will be shipped{' '}
                            to that address.
                        </div>
                        {shippingAddresses.map((shippingAddress, i) => <ShippingAddressCard
                                remainingFulfillableDevices={remainingFulfillableDevices}
                                totalVeeaHubOrderCount={totalVeeaHubOrderCount}
                                numShippingAddresses={shippingAddresses.length}
                                setShippingAddressValidators={setShippingAddressValidators(shippingAddress.id)}
                                setAddressIdToValidate={setAddressIdToValidate}
                                deleteVeeaHub={deleteShippingAddress(shippingAddress.id)}
                                shippingAddress={shippingAddress}
                                key={shippingAddress.id}
                                i={i}
                            />,
                        )}
                        <Button info
                            type="button"
                            onClick={addShippingAddress}
                            disabled={remainingFulfillableDevices <= totalVeeaHubOrderCount}>
                            Add another shipping address
                        </Button>
                        <hr className="w-full mt-30 mb-30" />
                        <div className="text-primary font-size-18 mb-10">Payment Information</div>
                        <div className="font-light font-size-18 text-grey mb-20">
                            If you decide to continue using the vTPN service after 30 days, your credit card{' '}
                            will be charged the monthly subscription. Your billing period begins on the 31st{' '}
                            day following the start of your free trial. Thereafter, you will be billed on the{' '}
                            monthly anniversary. You may cancel your subscription at any time by following the{' '}
                            instructions found on our support page.
                        </div>
                        <PaymentInfo country={country} submitted={submitted}
                            onPaymentChange={(hasChanged) => setPaymentWasChanged(hasChanged)}
                            setGetStripeToken={(fn) => setGetStripeToken(() => fn)}
                            setCheckPaymentIsValid={(fn) => setCheckPaymentIsValid(() => fn)}
                        />
                        <div className="flex mt-60">
                            <div className="cursor-pointer">
                                <input id="vptn-terms" type="checkbox"
                                    ref={el => agreeVtpnTermsRef.current.agreeVtpnTerms = el}
                                    checked={agreeVtpnTerms}
                                    onChange={() => setAgreeVtpnTerms(prevState => !prevState)} required />
                            </div>
                            <div className="font-size-14 pl-15">
                                <label htmlFor="vptn-terms">
                                    I've read and agree to&nbsp;
                                </label>
                                <a target="_blank" rel="noreferrer" href="https://www.veea.com/company/legal/vtpn-service-terms-of-use" className="text-info">
                                    vTPN Service Terms of Use
                                </a>
                            </div>
                        </div>
                        <input disabled={submitDisabled} type="submit" className="hidden" ref={submitRef} />
                    </form>
                    <SubmitButton disabled={submitDisabled} submitRef={submitRef} className="lg:hidden mt-30" />
                </>}
            </div>
            <SideBarContent confirmationPage={!!confirmationId}/>
        </Container>
        {!confirmationId && !outOfStock &&
            <SubmitButton disabled={submitDisabled} submitRef={submitRef} className="hidden lg:block" />}
    </>;
});

// tslint:disable-next-line: variable-name
const SubmitButton: FC<SubmitButtonProps> = ({ submitRef, className, disabled }) => (
    <div className={'mb-50' + (className ? ` ${className}` : '')}>
        <div className="flex justify-center">
            <Button type="submit" disabled={disabled} onClick={() => submitRef.current?.click()} info large wide>
                Submit Order
            </Button>
        </div>
    </div>
);

// tslint:disable-next-line: variable-name
const OutOfStock: FC<{}> = () => (<>
    <div className="text-primary font-size-18 mt-15 mb-10 font-bold">Thank you for your interest</div>
    <div className="font-light font-size-18 text-grey mb-40">
        <p>Unfortunately, we are unable to accept additional trial requests at this point.</p>
        <p className="mt-5">
            Please try again later or <a target="_blank" className="text-info font-bold" href="https://www.veea.com/contact-us-demo/">
                contact us
            </a> for more information
        </p>
    </div>
</>);

enum LoginRegisterOption {
    Login,
    Register,
}

export interface ShippingAddress {
    shipTo: string
    address: string
    zip: string
    city: string
    state: string
    qty: number
}

enum PackageSelection {
    vTPN,
    vTPN4G,
}

interface SubmitButtonProps {
    submitRef: RefObject<HTMLInputElement>
    className?: string
    disabled: boolean
}