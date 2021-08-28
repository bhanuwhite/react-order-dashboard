import React, { FC } from 'react';
import { Button, HeadTitle, Nothing, Separator, Spinner } from '@/components/core';
import { AddUserToACL } from '../AddUserTo/AddUserToACL';
import { useStore } from '@/hooks/useStore';
import { useACLAllFetcher, useACLUserFetcher } from '@/hooks/fetchers/acs-endpoints';
import { useParams } from 'react-router';
import { ErrorBox } from '@/components/core/Errors';
import { NotFoundBody } from '../../404';
import { EditACLModal } from './Modals/EditACLModal';
import { observer } from 'mobx-react-lite';
import { UserState } from '@/store/domain/users';
import { RemoveUserFromACLModal } from './Modals/RemoveUserFromACLModal';
import { UserItem } from '../UserItem';

interface ACLProps {}

// tslint:disable-next-line: variable-name
export const ACL: FC<ACLProps> = observer(() => {
    const [ openAddUsersModal, setOpenAddUsersModal ] = React.useState(false);
    const [ openEditAclModal, setOpenEditAclModal ] = React.useState(false);
    const [ openRemoveUserModal, setOpenRemoveUserModal ] = React.useState(false);
    const [ user, setUser ] = React.useState<null | UserState>(null);
    const store = useStore();
    const { aclId } = useParams<{ aclId?: string }>();
    const partnerId = store.view.activeuser.partnerId ?? '';
    const partner = store.domain.partners.map.get(partnerId);
    const acls = store.domain.partners.map.get(partnerId)?.acls ?? [];
    const acl = acls.find(a => a.id === Number(aclId));

    const { loading: loadingACLs, error: errorACLs, fetchNow: fetchACLs } = useACLAllFetcher(partnerId);
    const { loading: loadingUsers, error: errorUsers, fetchNow: fetchUsers } = useACLUserFetcher(partnerId, aclId);

    function onRemoveUser(userToRemove: UserState) {
        setUser(userToRemove);
        setOpenRemoveUserModal(true);
    }

    if (!partner) {
        if (loadingACLs || loadingUsers) {
            return <Spinner />;
        }
        if (errorACLs) {
            return <ErrorBox>{errorACLs.message}</ErrorBox>;
        }
        if (errorUsers) {
            return <ErrorBox>{errorUsers.message}</ErrorBox>;
        }
        // If we reach this, then one of either the response handler of
        // /ac/partner/:partnerId/acl or the response handler of
        // /ac/partner/:partnerId/acl/:aclId/user has a bug.
        //
        // FIXME: should we add an assertUnreachable function that throw
        //        an exception only in dev to detect those kind of bugs ?
        return <NotFoundBody />;
    }

    if (!acl) {
        return <NotFoundBody />;
    }

    return <>
        <HeadTitle>Veea Control Center - {acl.name}</HeadTitle>
        <EditACLModal
            partner={partner}
            acl={acl}
            open={openEditAclModal}
            onClose={() => setOpenEditAclModal(false)}
            refreshAcl={fetchACLs}
        />
        <AddUserToACL
            open={openAddUsersModal}
            onClose={() => setOpenAddUsersModal(false)}
            acl={acl}
            partner={partner}
            refreshUserList={fetchUsers}
        />
        <RemoveUserFromACLModal partner={partner} user={user} open={openRemoveUserModal} acl={acl}
            refreshACL={fetchUsers}
            onClose={() => setOpenRemoveUserModal(false)} />
        <div className="flex justify-between items-start">
            <div>
                <h3 className="mb-10"><b>Title</b></h3>
                <div>{acl?.name ?? ''}</div>
            </div>
            <div>
                <h3 className="mb-10"><b>Description</b></h3>
                <div>{acl?.description ?? 'No description available'}</div>
            </div>
            <Button onClick={() => setOpenEditAclModal(true)}>
                <i className="fas fa-pen mr-10"/>
                Edit info
            </Button>
        </div>
        <div className="flex mt-30 mb-15">
            <Separator className="flex-grow mt-0 mr-10">Testers</Separator>
            <Button success className="pl-10 text-success-color" onClick={() => setOpenAddUsersModal(true)}>
                <i className="fas fa-plus mr-5 font-size-12"/>
                Add testers
            </Button>
        </div>
        {
            acl.users.length === 0 && loadingUsers ?
            <Spinner /> :
            acl.users.length === 0 ?
            <Nothing>
                <div>This Testing Team has no testers</div>
                <div className="font-normal font-size-14 mt-10">
                    Testers listed here are allowed to download your application
                </div>
            </Nothing> :
            <div>
                <ul>
                    {acl.users.map(id => <UserItem key={id} userId={id} onRemoveUser={onRemoveUser} />)}
                </ul>
            </div>
        }
    </>;
});
