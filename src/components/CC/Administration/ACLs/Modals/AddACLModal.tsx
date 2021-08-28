import React, { FC } from 'react';
import { createACL } from '@/actions/acl';
import { ActionModal, Button } from '@/components/core';
import { TextField } from '@/components/core/Inputs';
import { useStore } from '@/hooks/useStore';
import { replaceACLTermWithTestingGroupTerm } from './helpers';

interface ModalProps {
    open: boolean
    onClose: () => void
    refreshAclList: () => void
}

// tslint:disable-next-line: variable-name
export const AddACLModal: FC<ModalProps> = ({open, onClose, refreshAclList: refreshACLs}) => {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const store = useStore();
    const partnerId = store.view.activeuser.partnerId ?? '';

    React.useEffect(() => {
        if (!open) {
            setTitle('');
            setDescription('');
        }
    }, [ open ]);

    return <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                text: `Create`,
                type: 'success' as const,
                run: async () => {
                    const res = await createACL(store, title, description, partnerId);

                    if (res.success) {
                        refreshACLs();
                        return {
                            success: true,
                            description: 'Testing Team successfully created!',
                        };
                    }
                    return {
                        success: false,
                        description: replaceACLTermWithTestingGroupTerm(res.message),
                    };
                },
            },
        ]}
        renderBtn={({ onClick, text, type }) =>
        <Button wide large onClick={onClick} disabled={!title && type === 'success'}
            className="ml-15 mt-20"
            success={type === 'success'}
            primary={type === 'primary'}
            error={type === 'error'}
        >{text}</Button>
    }>
            <h1 className="mb-20">Create new Testing Team</h1>
            <div className="flex flex-col mb-20 max-width-500 m-auto">
                <TextField required className="search-input"
                    type="text" value={title} onChange={setTitle}
                    label="Name"
                />
            </div>
            <div className="flex flex-col mb-20 max-width-500 m-auto">
                <TextField required className="search-input"
                    type="text" value={description} onChange={setDescription}
                    label="Description"
                />
            </div>
    </ActionModal>;
};
