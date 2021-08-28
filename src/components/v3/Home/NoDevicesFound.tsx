import { FC } from 'react';
import { Section } from '../core';


// tslint:disable-next-line: variable-name
export const NoDevicesFound: FC<Props> = ({ email }) => (
    <Section title="No Devices Found" infoLink={{ kind: 'tooltip', text: 'TODO' }} className="mx-4 md:mx-0 mb-6">
        <div>
            <div className="text-center p-5">
                <h3 className="font-bold">You don't currently have any VeeaHub paired to your account.</h3>
                <p>Please follow the instructions provided with your VeeaHub to add it to your account.</p>
                <p>
                    Once you have VeeaHubs addezd to your account, you can access and manage them{' '}
                    using Veea Control Center.
                </p>
            </div>
            <div className="text-sm text-center text-gray-400">
                This account (<span className="font-bold">{email}</span>) currently does not have any VeeaHubs{' '}
                associated with it.<br />If you believe this is an error, please contact your IT department or contact
                us by going to <a className="no-underline hover:underline text-primary" href="https://www.veea.com/support">www.veea.com/support</a>
            </div>
            <div className="h-px bg-gray-300 w-full px-40 my-8" />
            <div className="text-center mb-5">
                If you have recently ordered VeeaHubs, please visit{' '}
                <a target="_blank" className="font-bold no-underline hover:underline text-primary" href={`${window.VTPN_SIGNUP_URL}#/my-orders`}>My Orders</a>{' '}
                page to track and modify your order.
            </div>
        </div>
    </Section>
);

interface Props {
    email: string
}
