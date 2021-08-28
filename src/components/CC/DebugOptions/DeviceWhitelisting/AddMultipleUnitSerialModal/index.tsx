import { FC } from 'react';
import { useStore } from '@/hooks/useStore';
import { useAreWhitelistedFetcher } from '@/hooks/fetchers';
import { addToWhitelistUnits } from '@/actions';
import * as style from '../DeviceWhitelisting.module.scss';
import { ActionModal, Separator, Spinner } from '@/components/core';
import { observer } from 'mobx-react-lite';
import { parseUnitSerials } from '../helper';

interface Props {
    unitSerialValues: string
    open: boolean,
    onClose: () => void
    clearList: () => void
}

// tslint:disable-next-line: variable-name
export const AddMultipleUnitSerialModal: FC<Props> = observer(({ unitSerialValues, open, onClose, clearList }) => {
    const store = useStore();
    const unitSerials = parseUnitSerials(unitSerialValues);
    const { loading } = useAreWhitelistedFetcher(unitSerials, { isInvalid: !open });
    const noneInWhitelist = unitSerials
        .filter(us => store.domain.whitelisting.has(us) && !store.domain.whitelisting.get(us));
    const anyAlreadyInWhitelist = noneInWhitelist.length !== store.domain.whitelisting.size;

    return <ActionModal extended centered open={open} onClose={onClose} actions={[
        {
            text: 'Confirm',
            type: 'primary' as const,
            run: async () => {
                await addToWhitelistUnits(store, unitSerials);
                clearList();

                return {
                    success: true,
                    description: 'Successfully added to whitelist',
                };
            },
        },
    ]}>
        {loading ?
            <Spinner text="Searching VeeaHub" /> :
            <div className={`flex flex-col mb-20 m-auto max-width-500 ${style.whitelistModal}`}>
                <div className={style.text}>
                    {anyAlreadyInWhitelist &&
                    <p>
                        <i className="fas fa-times-circle" />
                        One or more unit serial are already in whitelist. They will be ignored.
                    </p>}
                    Are you sure you want to add the VeeaHubs?
                </div>
                <Separator className={style.separator} />
            </div>
        }
    </ActionModal>;
});
