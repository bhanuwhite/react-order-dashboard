import { FC } from 'react';
import { ActionModal } from '@/components/core';
import { UserState } from '@/store/domain/users';


// tslint:disable-next-line: variable-name
export const DeleteUserModal: FC<Props> = ({ user, open, onClose }) => {

    return <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                text: 'Delete',
                type: 'primary' as const,
                run: async () => {
                    return {
                        success: false,
                        description: `Not implemented yet`,
                    };
                },
            },
        ]}
    >
        <h1>Delete a user</h1>
        <hr />
        <h2 className="mb-10">
            Are you sure you want to delete user <b>{user.props.firstName} {user.props.lastName}</b>?
        </h2>
    </ActionModal>;
};

interface Props {
    user: UserState
    open: boolean
    onClose: () => void
}
