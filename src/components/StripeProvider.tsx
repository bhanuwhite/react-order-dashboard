import { FC } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(window.STRIPE_PUB_API_KEY);


// tslint:disable-next-line: variable-name
export const StripeProvider: FC<{}> = ({ children }) => (
    <Elements stripe={stripePromise} options={{ fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,700' }] } }>
        {children}
    </Elements>
);