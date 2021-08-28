import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { useGroupsByIdFetcher, useKeycloakAdminGetUserFetcher } from '@/hooks/fetchers';
import { SubGroups } from './SubGroups';
import { Button } from '@/components/core';
import { EditGroupInfoModal } from './Modals/EditGroupInfoModal';


// tslint:disable-next-line: variable-name
export const GroupInfo: FC<Props> = observer(({ groupId }) => {

    const store = useStore();
    const group = store.domain.groups.map.get(groupId);
    const contactId = group?.props.contactId ?? undefined;
    const user = store.domain.users.map.get(contactId ?? '');
    const [ open, setOpen ] = React.useState(false);

    // Refetch whenever we visit this page again. No fetch will occurs the first time
    // because the parent is already fetching it.
    const { fetchNow } = useGroupsByIdFetcher([groupId ?? ''], { isInvalid: !groupId });
    const { loading: loadingUserInfo } = useKeycloakAdminGetUserFetcher(contactId);

    return <>
        {group &&
            <EditGroupInfoModal group={group} open={open}
                onClose={() => setOpen(false)}
                refreshGroup={fetchNow}
            />
        }
        <div className="flex items-start mb-50">
            <div style={{ flexBasis: '400px' }}>
                <h3 className="mb-10"><b>Name</b></h3>
                <p>{group?.name ?? 'Loading...'}</p>
            </div>
            <div className="flex-grow" style={{ flexBasis: '400px' }}>
                <h3 className="mb-10"><b>Group contact</b></h3>
                {
                    user?.name ?
                    <p>{user.name}</p> :
                    !contactId ?
                    <p className="italic">No contact associated with this group</p> :
                    loadingUserInfo ?
                    <p>Loading...</p> :
                    <p className="italic text-grey">User {contactId} not found</p>
                }
            </div>
            <Button className="m-0 flex-shrink-0" inversed info onClick={() => setOpen(true)}>
                <i className="fas fa-pen mr-10"/>Edit info
            </Button>
        </div>
        <SubGroups groupId={groupId} />
    </>;
});

interface Props {
    groupId: string
}
