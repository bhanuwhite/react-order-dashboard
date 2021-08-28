import { FC } from 'react';
import { useStore } from '@/hooks/useStore';
import { useIsWhitelistedFetcher } from '@/hooks/fetchers';
import * as style from '../DeviceWhitelisting.module.scss';
import { ActionModal, Separator, Spinner } from '@/components/core';
import { observer } from 'mobx-react-lite';
import { Store } from '@/store';
import { RequestResult } from '@/actions/helpers';

interface ModalProps {
    unitSerialValue: string
    open: boolean
    setOpen(open: boolean): void
    verifyWhitelistStatus(isWhitelisted: boolean): boolean
    whitelistAction(store: Store, unitSerialValue: string[]): Promise<RequestResult<{}>>
    confirmMsg: string
    successMsg: string
    warningMsg: string
}

// tslint:disable-next-line: variable-name
const UnitSerialActionModal: FC<ModalProps> = observer(({
    unitSerialValue,
    open,
    verifyWhitelistStatus,
    setOpen,
    whitelistAction,
    confirmMsg,
    successMsg,
    warningMsg,
}) => {
    const store = useStore();
    const { loading } = useIsWhitelistedFetcher(unitSerialValue, { isInvalid: !open });
    const isWhitelisted = !!store.domain.whitelisting.get(unitSerialValue);
    const actions:any[] = [];

    if (verifyWhitelistStatus(isWhitelisted)) {
        const confirmAction = {
            text: 'Confirm',
            type: 'primary' as const,
            run: async () => {
                await whitelistAction(store, [unitSerialValue]);

                return {
                    success: true,
                    description: successMsg,
                };
            },
        };
        actions.push(confirmAction);
    }

    return <ActionModal extended centered open={open} onClose={() => setOpen(false)} actions={actions}>
        {loading && <Spinner text="Searching device" />}
        {!loading && verifyWhitelistStatus(isWhitelisted) &&
        <div className={`flex flex-col mb-20 m-auto max-width-500 ${style.whitelistModal}`}>
            <div className={style.text}>
                {confirmMsg}
            </div>
            <Separator className={style.separator} />
        </div>}
        {!loading && !verifyWhitelistStatus(isWhitelisted) &&
        <div className={`flex flex-col mb-20 m-auto max-width-500  ${style.whitelistModal} ${style.error}`}>
            <div className={style.text}>
                <i className="fas fa-times-circle" /> {warningMsg}
            </div>
            <Separator className={style.separator} />
        </div>}
    </ActionModal>;
});

export default UnitSerialActionModal;
