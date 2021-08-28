import * as React from 'react';
import { FC } from 'react';
import { ActionModal, Button } from '@/components/core';
import { GroupState } from '@/store/domain/groups';
import { useStore } from '@/hooks/useStore';
import { TextField } from '@/components/core/Inputs';
import { updateGroup } from '@/actions';


// tslint:disable-next-line: variable-name
export const EditGroupInfoModal: FC<Props> = ({ group, open, onClose, refreshGroup }) => {

    const store = useStore();
    const [ localName, setLocalName ] = React.useState(group.name);
    const groupId = group.id;

    React.useEffect(() => {
        if (open) {
            setLocalName(group.name);
        }
    }, [ open ]);

    return <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                type: 'success' as const,
                text: 'Rename',
                run: async () => {
                    const res = await updateGroup(store, groupId, localName);
                    if (res.success) {
                        refreshGroup();
                        return {
                            success: true,
                            description: `Group successfully renamed`,
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
            <Button wide large onClick={onClick} disabled={(!localName) && type === 'success'}
                className="ml-15 mt-20"
                success={type === 'success'}
                primary={type === 'primary'}
                error={type === 'error'}
            >{text}</Button>
        }
    >
        <h1 className="mb-40">Rename <b>{group.name}</b></h1>
        <div className="flex flex-col mb-20 m-auto max-width-500">
            <TextField label="Name" value={localName} onChange={setLocalName} />
        </div>
    </ActionModal>;
};

interface Props {
    group: GroupState
    open: boolean
    onClose: () => void
    refreshGroup: () => void
}
