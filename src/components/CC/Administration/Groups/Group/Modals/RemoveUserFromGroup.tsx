import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { UserState } from '@/store/domain/users';
import { ActionModal } from '@/components/core';
import { useStore } from '@/hooks/useStore';
import { useGroupsByIdFetcher } from '@/hooks/fetchers';
import { removeUserFromGroup } from '@/actions';
import { useHistory } from 'react-router';


// tslint:disable-next-line: variable-name
export const RemoveUserFromGroup: FC<Props> = observer(({ open, onClose, refreshUserList, user, groupId }) => {

    const store = useStore();
    const history = useHistory();
    const activeUserId = store.view.activeuser.keycloakUUID;
    const group = store.domain.groups.map.get(groupId);
    const name = group?.name ?? `Group ${groupId}`;

    // Refetch whenever we visit this modal (so we get the latest group name)
    useGroupsByIdFetcher([groupId], { isInvalid: !groupId });


    return <ActionModal open={open} onClose={onClose} extended centered actions={[
        {
            type: 'primary' as const,
            text: 'Remove',
            run: async () => {
                if (!user || !group) {
                    return {
                        success: false,
                        description: `Try again later`,
                    };
                }
                const res = await removeUserFromGroup(store, group, user.id);
                if (res.success) {

                    if (user.id !== activeUserId) {
                        refreshUserList();
                    }

                    return {
                        success: true,
                        description: `You have successfully removed ${user.name} from ${name}`,
                        onClose: () => history.push('/cc/admin/groups'),
                    };
                }
                return {
                    success: false,
                    description: res.message,
                };
            },
        },
    ]}>
        <h1 className="mb-20">Remove {user?.name} from {name}</h1>
        <hr />
        <h2 className="mb-10">
            After removed, {user?.name} won't be able to manage <b>{name}</b>'s VeeaHubs.
        </h2>
    </ActionModal>;
});

interface Props {
    open: boolean
    onClose: () => void
    refreshUserList: () => void
    user: UserState | null
    groupId: string
}
