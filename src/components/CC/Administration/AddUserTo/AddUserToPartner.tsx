import { FC } from 'react';
import { assignUserToPartner } from '@/actions';
import { PartnerState } from '@/store/domain/partners';
import { useStore } from '@/hooks/useStore';
import { AddUserTo } from './AddUserTo';


// tslint:disable-next-line: variable-name
export const AddUserToPartner: FC<Props> = ({ open, onClose, partner, refreshUserList }) => {

    const store = useStore();
    const name = !partner.props.isPartial ? partner.props.name : `Partner ${partner.id}`;

    return <AddUserTo onClose={onClose} open={open}
        name={name}
        addUserToEntity={(user) => assignUserToPartner(store, partner.id, user.props.veeaUserId!)}
        hasUser={(u) => partner.users.includes(u.props.veeaUserId ?? '')}
        refresh={refreshUserList}
    />;
};

interface Props {
    open: boolean
    onClose: () => void
    partner: PartnerState
    refreshUserList: () => Promise<void>
}