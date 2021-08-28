import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { ActionModal } from '@/components/core';
import { assertPartnerPropsIsNotPartial, PartnerState } from '@/store/domain/partners';
import { UserState } from '@/store/domain/users';
import { removeUserFromPartner } from '@/actions';
import { useStore } from '@/hooks/useStore';


// tslint:disable-next-line: variable-name
export const RemoveUserFromPartner: FC<Props> = observer(({ user, open, onClose, partner, refreshPartner }) => {

    const store = useStore();
    const partnerProps = partner.props;
    assertPartnerPropsIsNotPartial(partnerProps);

    return <ActionModal open={open} onClose={onClose} extended centered actions={[
        {
            type: 'primary' as const,
            text: 'Remove',
            run: async () => {
                if (!user || !user.props.veeaUserId) {
                    // This path should not be reachable.
                    return {
                        success: false,
                        description: user ? 'User doesn\'t have a valid veea user id' : 'Bug found!',
                    };
                }
                const res = await removeUserFromPartner(store, partner.id, user!.props.veeaUserId);
                if (res.success) {
                    refreshPartner();
                    return {
                        success: true,
                        description: <>{user.name} was successfully removed from <b>{partnerProps.name}</b></>,
                    };
                }
                return {
                    success: false,
                    description: res.message,
                };
            },
        },
    ]}>
        <h1 className="mb-20">Remove {user?.name} from {partnerProps.name}</h1>
        <hr />
        <h2 className="mb-10">
            After removed, {user?.name} won't be able to modify <b>{partnerProps.name}</b>'s Applications.
        </h2>
    </ActionModal>;
});

interface Props {
    open: boolean
    onClose: () => void
    refreshPartner: () => void
    user: UserState | null
    partner: PartnerState
}
