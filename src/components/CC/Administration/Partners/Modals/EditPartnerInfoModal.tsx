import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { updatePartnerInfo } from '@/actions';
import { ActionModal, Button } from '@/components/core';
import { TextField } from '@/components/core/Inputs';
import { useStore } from '@/hooks/useStore';


// tslint:disable-next-line: variable-name
export const EditPartnerInfoModal: FC<Props> = observer(({ id, name, description, open, onClose }) => {

    const store = useStore();
    const [ localName, setLocalName ] = React.useState(name);
    const [ localDescription, setLocalDescription ] = React.useState(description);

    React.useEffect(() => {
        if (open) {
            setLocalName(name);
            setLocalDescription(description);
        }
    }, [open]);

    return <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                type: 'primary' as const,
                text: 'Update',
                run: async () => {
                    const res = await updatePartnerInfo(store, id, localName, localDescription);
                    if (res.success) {
                        return {
                            success: true,
                            description: 'Partner successfully updated',
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
            <Button wide large onClick={onClick} disabled={(!localName || !localDescription) && type === 'primary'}
                className="ml-15 mt-20"
                success={type === 'success'}
                primary={type === 'primary'}
                error={type === 'error'}
            >{text}</Button>
        }>
        <h1 className="mb-40">Update {name} details</h1>
        <div className="flex flex-col mb-20 m-auto max-width-500">
            <TextField label="Name" value={localName} onChange={setLocalName} />
            <TextField label="Description" value={localDescription} onChange={setLocalDescription} />
        </div>
    </ActionModal>;
});

interface Props {
    name: string
    description: string
    id: string
    open: boolean
    onClose: () => void
}