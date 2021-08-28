import * as React from 'react';
import { FC } from 'react';
import { UserState } from '@/store/domain/users';
import { Invitee } from '@/store/domain/groups/invitees';
import { useStore } from '@/hooks/useStore';
import { useInviteesToGroupFetcher, useUsersInGroupByPage } from '@/hooks/fetchers';
import { Button, Spinner, PaginationButtons, Separator, Nothing } from '@/components/core';
import { AddUserToGroup } from '@/components/CC/Administration/AddUserTo/AddUserToGroup';
import { ErrorBox } from '@/components/core/Errors';
import { UserItem } from '../../UserItem';
import { InviteeItem } from './Items/InviteeItem';
import { RemoveUserFromGroup } from './Modals/RemoveUserFromGroup';
import { CancelInvitationToGroup } from './Modals/CancelInvitationToGroup';
import { JoinGroupModal } from './Modals/JoinGroupModal';
import { USER_GROUPS_LIMIT } from '@/consts/groups';


// tslint:disable-next-line: variable-name
export const GroupUsers: FC<Props> = ({ groupId }) => {

    const store = useStore();
    const [ addUserOpen, setAddUserOpen ] = React.useState(false);
    const [ removeUserOpen, setRemoveUserOpen ] = React.useState(false);
    const [ cancelInviteOpen, setCancelInviteOpen ] = React.useState(false);
    const [ joinGroupOpen, setJoinGroupOpen ] = React.useState(false);
    const [ user, setUser ] = React.useState<null | UserState>(null);
    const [ invId, setInvId ] = React.useState('');

    const userBelongsToGroup = store.view.activeuser.groups.includes(groupId);
    const limitReached = store.view.activeuser.groups.length >= USER_GROUPS_LIMIT;
    const {
        loading: loadingInvitees,
        fetchNow: fetchInvitees,
        error: inviteeErrors,
    } =  useInviteesToGroupFetcher(groupId, { isInvalid: !userBelongsToGroup } );
    const {
        prev, next, hasNext, hasPrev,
        fetchNow: fetchUsers,
        loading: loadingUsers, error: usersErrors,
        page,
    } = useUsersInGroupByPage(groupId);
    const loading = loadingInvitees || loadingUsers;
    // FIXME: find a better solution to merge error message than this.
    const error = inviteeErrors || usersErrors;
    const group = store.domain.groups.map.get(groupId);
    const invitees = group?.invitees.all ?? [];
    const users = store.domain.users.getUsersForPage(page);
    // FIXME: firstLoad should be introduced in the fetcher instead of this heuristic
    const firstLoad = loading && (!group || users.length === 0);


    function onRemoveUser(userToRemove: UserState) {
        setUser(userToRemove);
        setRemoveUserOpen(true);
    }

    function onCancelInvitee(inviteToCancel: Invitee) {
        setInvId(inviteToCancel.id);
        setCancelInviteOpen(true);
    }

    function onJoinGroup() {
        setJoinGroupOpen(true);
    }

    async function fetchAllNow() {
        await fetchInvitees();
        await fetchUsers();
    }

    return <>
        <JoinGroupModal groupId={groupId} refreshUsersList={fetchUsers}
            open={joinGroupOpen} onClose={() => setJoinGroupOpen(false)}
        />
        <AddUserToGroup groupId={groupId} refreshUserList={fetchAllNow}
            open={addUserOpen} onClose={() => setAddUserOpen(false)}
        />
        <RemoveUserFromGroup groupId={groupId} user={user} open={removeUserOpen}
            onClose={() => setRemoveUserOpen(false)}
            refreshUserList={fetchUsers}
        />
        <CancelInvitationToGroup groupId={groupId} invId={invId} open={cancelInviteOpen}
            onClose={() => setCancelInviteOpen(false)}
            refreshInviteeList={fetchInvitees}
        />
        <div className="flex justify-end">
            <div>
                <Button success disabled={firstLoad || userBelongsToGroup || limitReached} onClick={onJoinGroup} title={
                    userBelongsToGroup ? `You already belong to this group` :
                    limitReached ? `You have reached the maximum number of groups you can belong to` :
                    `Join this group`
                }>
                    <i className="fas fa-plus mr-5" />Join group
                </Button>
                <Button success disabled={!userBelongsToGroup} onClick={() => setAddUserOpen(true)}>
                    <i className="fas fa-plus mr-5" />Invite Users
                </Button>
            </div>
        </div>
        { userBelongsToGroup && <Separator className="mt-20 mb-15">Invitees</Separator> }
        {
            !userBelongsToGroup ? null :
            invitees.length === 0 && loadingInvitees ? <Spinner /> :
            invitees.length === 0 ?
            <Nothing raw className="font-size-14">
                <div className="font-bold mb-10 font-size-16">There are no pending invitations to join this group</div>
                <div>
                    {/* tslint:disable-next-line: max-line-length */}
                    You can <span className="cursor-pointer text-primary hover:underline" onClick={() => setAddUserOpen(true)}>invite users</span> to join this group.
                </div>
                Once invited, they will show up here until{' '}
                they've accepted or declined their invitation.
            </Nothing> :
            <ul>
                {invitees.map(invitee =>
                    <InviteeItem key={invitee.id} invitee={invitee} onCancelInvitee={onCancelInvitee} />,
                )}
            </ul>
        }
        <Separator className="mt-20 mb-15">Users</Separator>
        {
            error && <ErrorBox className="mb-15">{error.message}</ErrorBox>
        }
        {
            users.length === 0 && loadingUsers ? <Spinner /> :
            users.length === 0 ?
            <Nothing>
                This group has no users.
            </Nothing> :
            <ul>
                {users.map(u =>
                    <UserItem skipFetch key={u.id} userId={u.props.veeaUserId}
                        onRemoveUser={onRemoveUser} removeUserDisabled={u.id === group?.props.contactId}
                    />,
                )}
            </ul>
        }
        {
            (hasNext || hasPrev) &&
            <PaginationButtons className="mt-15"
                prevPage={prev}
                nextPage={next}
                hasNext={hasNext}
                hasPrev={hasPrev} />
        }
    </>;
};

interface Props {
    groupId: string
}