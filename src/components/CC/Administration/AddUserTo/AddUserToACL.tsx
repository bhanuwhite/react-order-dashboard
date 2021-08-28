import { FC } from 'react';
import { assignUserToACL } from '@/actions';
import { ACLInfo, PartnerState } from '@/store/domain/partners';
import { useStore } from '@/hooks/useStore';
import { AddUserTo } from './AddUserTo';


// tslint:disable-next-line: variable-name
export const AddUserToACL: FC<Props> = ({ open, onClose, acl, partner, refreshUserList }) => {

    const store = useStore();

    return <AddUserTo onClose={onClose} open={open}
        name={acl.name} emailOnly
        addUserToEntity={(user) => assignUserToACL(store, partner.id, acl.id, user.props.veeaUserId!)}
        hasUser={(u) => acl.users.includes(u.props.veeaUserId ?? '')}
        refresh={refreshUserList}
        userDescriptiveName="tester"
    />;
};

interface Props {
    open: boolean
    onClose: () => void
    partner: PartnerState
    acl: ACLInfo
    refreshUserList: () => Promise<void>
}