import { FC } from 'react';
import { ActionModal } from '@/components/core';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { declineInvitation } from '@/actions';


// tslint:disable-next-line: variable-name
export const CancelInvitationToGroup: FC<Props> = observer(({ open, onClose, refreshInviteeList, groupId, invId }) => {

    const store = useStore();
    const group = store.domain.groups.map.get(groupId);
    const name = group?.name;
    const invite = group?.invitees.map.get(invId);
    const userName = invite?.type === 'email' ? invite.user_email :
        invite?.type === 'user_id' ? store.domain.users.map.get(invite.user_id)?.name :
        'Unknown';

    return <ActionModal open={open} onClose={onClose} extended centered actions={[
        {
            type: 'primary' as const,
            text: 'Remove',
            run: async () => {

                const res = await declineInvitation(store, invId);
                if (res.success) {
                    refreshInviteeList();
                    return {
                        success: true,
                        description: 'Invitation successfully cancelled.',
                    };
                }

                return {
                    success: false,
                    description: res.message,
                };
            },
        },
    ]}>
        <h1 className="mb-20">Cancel invitation for {userName}</h1>
        <hr />
        <h2 className="mb-10">
            Once cancelled, {userName} won't be able to join <b>{name}</b>.
        </h2>
    </ActionModal>;
});

interface Props {
    open: boolean
    onClose: () => void
    refreshInviteeList: () => void
    invId: string
    groupId: string
}
