import { ActionModal, Separator, Spinner } from '@/components/core';
import { useIsWhitelistedFetcher } from '@/hooks/fetchers';
import { useStore } from '@/hooks/useStore';
import { FC } from 'react';
import { addToWhitelistUnits, removeFromWhitelistUnits } from '@/actions/whitelist';
import * as style from '../DeviceWhitelisting.module.scss';
import { observer } from 'mobx-react-lite';

interface ModalProps {
    unitSerial: string
    open: boolean
    onClose(): void
}

// tslint:disable-next-line: variable-name
export const DeviceFoundModal: FC<ModalProps> = observer(({ unitSerial, open, onClose }) => {
    const store = useStore();
    const { loading } = useIsWhitelistedFetcher(unitSerial, { isInvalid: !open || !unitSerial });
    const isWhitelisted = !!store.domain.whitelisting.get(unitSerial);

    return <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                text: `${!isWhitelisted ? 'Whitelist this VeeaHub' : 'Remove VeeaHub from whitelist'}`,
                type: 'primary' as const,
                run: async () => {
                    let description = 'Successfully added to whitelist';

                    if (!isWhitelisted) {
                        await addToWhitelistUnits(store, [unitSerial]);
                    } else {
                        await removeFromWhitelistUnits(store, [unitSerial]);
                        description = 'Successfully removed from whitelist';
                    }

                    return {
                        success: true,
                        description,
                    };
                },
            },
        ]}
    >
        {loading && <Spinner text="Searching VeeaHub" />}
        {!loading && !isWhitelisted && <div className={`flex flex-col mb-20 m-auto max-width-500 ${style.whitelistModal} ${style.error}`}>
            <div className={style.text}>
                <i className="fas fa-times-circle" />
                VeeaHub {unitSerial} is not whitelisted
            </div>
            <Separator className={style.separator} />
        </div>}
        {!loading && isWhitelisted && <div className={`flex flex-col mb-20 m-auto max-width-500 ${style.whitelistModal} ${style.success}`}>
            <div className={style.text}>
                <i className="fas fa-check-circle" />VeeaHub {unitSerial} is whitelisted
            </div>
            <Separator className={style.separator} />
        </div>}
    </ActionModal>;
});
