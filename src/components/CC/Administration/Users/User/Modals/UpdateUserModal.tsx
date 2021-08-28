import { FC } from 'react';
import { UserState } from '@/store/domain/users';
import { ActionModal } from '@/components/core';


// tslint:disable-next-line: variable-name
export const UpdateUserModal: FC<Props> = ({ user, open, onClose }) => {
    return <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                text: 'Update',
                type: 'success' as const,
                run: async () => {
                    return {
                        success: false,
                        description: `Not implemented yet`,
                    };
                },
            },
        ]}
    >
        <h1>Update {user.props.firstName}'s details</h1>
        <hr />
        <ul>
            <li></li>
        </ul>
        <h2 className="mb-10">
            Are you sure you want to update user <b>{user.props.firstName} {user.props.lastName}</b>?
        </h2>
    </ActionModal>;
};

interface Props {
    user: UserState
    newFields: NewUserFields
    open: boolean
    onClose: () => void
}

interface NewUserFields {
    email?: string
    firstName?: string
    lastName?: string
    role?: string
}