import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, HeadTitle, LinkButton } from '@/components/core';
import { useVFFOrderFetcher } from '@/hooks/fetchers';
import { useStore } from '@/hooks/useStore';


// tslint:disable-next-line: variable-name
export const OrderConfirmation: FC<{ confirmationId: string }> = observer(({ confirmationId }) => {
    const store = useStore();
    useVFFOrderFetcher(confirmationId, { isInvalid: !store.view.activeuser.isLoggedIn });
    return <>
        <HeadTitle>Veea - vTPN - Confirmation</HeadTitle>
        <div className="flex">
            {/* <img src={`${ASSETS_IMAGES_FOLDER}/modal/icon-success.svg`} className="h-50 mr-20" /> */}
            <div>
                <div className="text-primary font-size-18 mb-10">Order Received.</div>
                <div className="font-light font-size-18 text-grey">
                    Thank you for choosing Veea!
                </div>
            </div>
        </div>
        <hr className="w-full mt-30 mb-30" />
        <div className="mb-30">
            <div className="mb-10 font-size-18 font-light">We've received your order.</div>
            <div className="mb-10 font-size-18 font-light">Your VeeaHub(s) will be delivered in 2-3 business days.</div>
            <div className="mb-10 font-size-18 font-bold">Order Reference ID: {confirmationId}</div>
        </div>
        <div className="flex justify-between mb-30">
            <Button onClick={() => window.print()} className="w-150 text-info border-info border-2">
                Print
            </Button>
            <LinkButton info to="/my-orders/" className="w-150">
                View my orders
            </LinkButton>
        </div>
    </>;
});