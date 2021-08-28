import * as React from 'react';
import { FC } from 'react';
import { ActionModal, Button } from '@/components/core';
import { createPartner } from '@/actions';
import { useStore } from '@/hooks/useStore';
import { TextField } from '@/components/core/Inputs';


// tslint:disable-next-line: variable-name
export const AddPartnerModal: FC<Props> = ({ open, onClose, refreshPartnerList }) => {

    const store = useStore();
    const [ name, setName ] = React.useState('');
    const [ description, setDescription ] = React.useState('');
    const [ id, setId ] = React.useState('');
    const [ idWasChangedOnce, setIdWasChangedOnce ] = React.useState(false);

    React.useEffect(() => {
        if (!open) {
            setName('');
            setDescription('');
            setId('');
            setIdWasChangedOnce(false);
        }
    }, [ open ]);

    function onChangeId(newId: string) {
        setId(newId);
        setIdWasChangedOnce(true);
    }

    const isIdValid = /^[0-9A-Fa-f]{8}$/.test(id);

    return <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                type: 'success' as const,
                text: 'Create',
                run: async () => {
                    const res = await createPartner(store, id.toUpperCase(), name, description);
                    if (res.success) {
                        refreshPartnerList();
                        return {
                            success: true,
                            description: 'Partner successfully created!',
                        };
                    }
                    return {
                        success: false,
                        description: res.message,
                    };
                },
            },
        ]}
        renderBtn={({ onClick, text, type }) =>
            <Button wide large onClick={onClick} disabled={(!name || !description || !isIdValid) && type === 'success'}
                className="ml-15 mt-20"
                success={type === 'success'}
                primary={type === 'primary'}
                error={type === 'error'}
            >{text}</Button>
    }>
        <h1 className="mb-20">Create new Partner</h1>
        <div className="flex flex-col mb-20 max-width-500 m-auto">
            <TextField label="Name" value={name} onChange={setName} />
            <TextField invalid={!isIdValid && idWasChangedOnce} label={<>
                Partner ID <span className="opacity-50 italic">(hexadecimal number with exactly 8 characters)</span>
            </>} value={id} onChange={onChangeId} />
            <TextField label="Description" value={description} onChange={setDescription} />
        </div>
    </ActionModal>;
};

interface Props {
    open: boolean
    onClose: () => void
    refreshPartnerList: () => void
}
