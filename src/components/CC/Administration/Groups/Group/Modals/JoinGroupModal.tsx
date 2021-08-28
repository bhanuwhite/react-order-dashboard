import { FC } from 'react';
import { ActionModal } from '@/components/core';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { joinGroup } from '@/actions';
import { useGroupsByIdFetcher } from '@/hooks/fetchers';


// tslint:disable-next-line: variable-name
export const JoinGroupModal: FC<Props> = observer(({ open, onClose, refreshUsersList, groupId }) => {
    const store = useStore();
    const group = store.domain.groups.map.get(groupId);
    const name = group?.name ?? `Group ${groupId}`;

    // Refetch whenever we visit this modal (so we get the latest group name)
    useGroupsByIdFetcher([groupId], { isInvalid: !groupId });

    return <ActionModal open={open && !!group} onClose={onClose} extended centered actions={[
        {
            type: 'success' as const,
            text: 'Join',
            run: async () => {
                const gr = group!;
                const res = await joinGroup(store, gr);
                if (res.success) {
                    refreshUsersList();
                    return {
                        success: true,
                        description: `You have successfully joined ${name}`,
                    };
                }
                return {
                    success: false,
                    description: res.message,
                };
            },
        },
    ]}>
        <h1 className="mb-20">Join <b>{name}</b></h1>
        <hr />
        <div className="mb-10 max-width-500 m-auto text-d-grey">
            Once you've joined the group you'll be able to select this group from{' '}
            the group selection dropdown in the top bar.
        </div>
    </ActionModal>;
});

interface Props {
    open: boolean
    onClose: () => void
    refreshUsersList: () => void
    groupId: string
}
