import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { ActionModal } from '@/components/core';
import { ACLInfo, PartnerState } from '@/store/domain/partners';
import { UserState } from '@/store/domain/users';
import { removeUserFromACL } from '@/actions';
import { useStore } from '@/hooks/useStore';


// tslint:disable-next-line: variable-name
export const RemoveUserFromACLModal: FC<Props> = observer(({ user, acl, open, onClose, partner, refreshACL }) => {

    const store = useStore();

    return <ActionModal open={open} onClose={onClose} extended centered actions={[
        {
            type: 'primary' as const,
            text: 'Remove',
            run: async () => {
                if (!user || !user.props.veeaUserId) {
                    // This path should not be reachable.
                    return {
                        success: false,
                        description: user ? 'Tester doesn\'t have a valid veea user id' : 'Bug found!',
                    };
                }
                const res = await removeUserFromACL(store, partner.id, `${acl.id}`, user!.props.veeaUserId);
                if (res.success) {
                    refreshACL();
                    return {
                        success: true,
                        description: <>{user.name} was successfully removed from <b>{acl.name}</b></>,
                    };
                }
                return {
                    success: false,
                    description: res.message,
                };
            },
        },
    ]}>
        <h1 className="mb-20">Remove {user?.name} from {acl.name}</h1>
        <hr />
        <h2 className="mb-10">
            After removed, {user?.name} won't be able to install Applications that uses <b>{acl.name}</b>.
        </h2>
    </ActionModal>;
});

interface Props {
    open: boolean
    onClose: () => void
    refreshACL: () => void
    user: UserState | null
    partner: PartnerState
    acl: ACLInfo
}
