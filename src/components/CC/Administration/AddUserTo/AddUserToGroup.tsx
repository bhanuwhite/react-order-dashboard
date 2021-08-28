import { FC } from 'react';
import { useStore } from '@/hooks/useStore';
import { AddUserTo } from './AddUserTo';
import { observer } from 'mobx-react-lite';
import { inviteUserToGroup } from '@/actions';
import { useGroupsByIdFetcher } from '@/hooks/fetchers';


// tslint:disable-next-line: variable-name
export const AddUserToGroup: FC<Props> = observer(({ open, onClose, groupId, refreshUserList }) => {

    const store = useStore();
    const group = store.domain.groups.map.get(groupId);
    const name = group?.name ?? `Group ${groupId}`;

    // Refetch whenever we visit this modal (so we get the latest group name)
    useGroupsByIdFetcher([ groupId ], { isInvalid: !groupId });

    return <AddUserTo onClose={onClose} open={open} allowAddOnEmptyResult
        addText="Invite" addedText="Invite sent" name={name}
        addUserToEntity={(user, userEmail) => inviteUserToGroup(store, groupId, name, user?.id, userEmail)}
        hasUser={(u) =>
            !!group?.users.includes(u.id) ||
            !!group?.invitees.all.some(inv => inv.type === 'user_id' && inv.user_id === u.id)
        }
        hasEmail={(email) => !!group?.invitees.all.some(inv => inv.type === 'email' && inv.user_email === email)}
        refresh={refreshUserList}
        additionalInfo={
            <div className="italic font-size-12 mt-10">
                No existing user could be found, to join they will have to create an account first
            </div>
        }
    />;
});

interface Props {
    open: boolean
    onClose: () => void
    groupId: string
    refreshUserList: () => Promise<void>
}
