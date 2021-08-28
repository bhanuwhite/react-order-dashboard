import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { updateAclInfo } from '@/actions/acl';
import { ACLInfo, PartnerState } from '@/store/domain/partners';
import { ActionModal } from '@/components/core';
import { TextField } from '@/components/core/Inputs';
import { useStore } from '@/hooks/useStore';
import { replaceACLTermWithTestingGroupTerm } from './helpers';


// tslint:disable-next-line: variable-name
export const EditACLModal: FC<Props> = observer(({ partner, acl, open, onClose, refreshAcl }) => {

    const store = useStore();
    const [ name, setName ] = React.useState(acl.name);
    const [ description, setDescription ] = React.useState(acl?.description ?? '');

    React.useEffect(() => {
        if (open) {
            setName(acl.name);
            setDescription(acl?.description ?? '');
        }
    }, [open]);

    return <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                type: 'primary' as const,
                text: 'Update',
                run: async () => {
                    const res = await updateAclInfo(store, partner.id, `${acl.id}`, name, description);
                    if (res.success) {
                        refreshAcl();

                        return {
                            success: true,
                            description: 'Testing Team successfully updated',
                        };
                    }
                    return {
                        success: false,
                        description: replaceACLTermWithTestingGroupTerm(res.message),
                    };
                },
            },
        ]}>
        <h1 className="mb-40">Update {acl.name} details</h1>
        <div className="flex flex-col mb-20 m-auto max-width-500">
            <TextField label="Name" value={name} onChange={setName} />
            <TextField label="Description" value={description} onChange={setDescription} />
        </div>
    </ActionModal>;
});

interface Props {
    partner: PartnerState
    acl: ACLInfo
    open: boolean
    onClose: () => void
    refreshAcl: () => Promise<void>
}
