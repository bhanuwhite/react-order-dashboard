import { FC } from 'react';
import { useRoles } from '@/hooks/fetchers';
import { formatRole } from '@/utils/format';
import { Select } from '@/components/core';


// tslint:disable-next-line: variable-name
export const RoleDropdown: FC<Props> = ({ role, setRole, className }) => {
    const { roles } = useRoles();
    return <Select outerLabelAbove label="Role" value={role} onChange={setRole} className={className}>
        {roles.map((r) => <option key={r.id} value={r.id}>{formatRole(r.name)}</option>)}
    </Select>;
};

interface Props {
    className?: string
    role: string
    setRole: (newRole: string) => void
}