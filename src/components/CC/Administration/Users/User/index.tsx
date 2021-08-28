import * as React from 'react';
import { FC } from 'react';
import { Spinner, CollapsiblePanel, Button } from '@/components/core';
import { useParams, useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { useUserByIdFetcher } from '@/hooks/fetchers';
import { ErrorBox } from '@/components/core/Errors';
import { NotFoundBody } from '@/components/CC/404';
import { UserState } from '@/store/domain/users';
import { RoleDropdown } from './RoleDropdown';
import { TextField } from '@/components/core/Inputs';
import { DeleteUserModal } from './Modals/DeleteUserModal';
import { UpdateUserModal } from './Modals/UpdateUserModal';


// tslint:disable-next-line: variable-name
export const User: FC<Props> = observer(({}) => {

    const store = useStore();
    const { userId } = useParams<{ userId: string }>();
    const { loading, error } = useUserByIdFetcher(userId, { isInvalid: !userId });
    const user = store.domain.users.map.get(userId);

    if (error) {
        return <ErrorBox>{error.message}</ErrorBox>;
    } else if (loading) {
        return <Spinner />;
    } else if (user) {
        return <UserDetails user={user} />;
    } else {
        return <NotFoundBody />;
    }
});

interface Props {}

// tslint:disable-next-line: variable-name
export const UserDetails: FC<{ user: UserState }> = observer(({ user }) => {

    const history = useHistory();
    const [ email, setEmail ] = React.useState(user.props.email);
    const [ firstName, setFirstName ] = React.useState(user.props.firstName);
    const [ lastName, setLastName ] = React.useState(user.props.lastName);
    const [ phoneNumber, setPhoneNumber ] = React.useState('');
    const [ company, setCompany ] = React.useState('');
    const [ country, setCountry ] = React.useState('');
    const [ role, setRole ] = React.useState(user.props.role!.id);
    const [ saveModalOpen, setSaveModalOpen ] = React.useState(false);
    const [ delModalOpen, setDelModalOpen ] = React.useState(false);

    const newFields = {
        email: email !== user.props.email ? email : undefined,
        firstName: firstName !== user.props.firstName ? firstName : undefined,
        lastName: lastName !== user.props.lastName ? lastName : undefined,
        // phoneNumber: phoneNumber !== user.props.phoneNumber ? phoneNumber : undefined,
        // company: company !== user.props.company ? company : undefined,
        // country: country !== user.props.country ? country : undefined,
        role: role !== user.props.role!.id ? role : undefined,
    };
    const hasAnyChanges = Object.values(newFields).some(c => typeof c !== 'undefined');

    function onCancel() {
        history.goBack();
    }

    function onSave() {
        setSaveModalOpen(true);
    }

    function onDelete() {
        setDelModalOpen(true);
    }

    return <>
        <UpdateUserModal user={user} newFields={newFields}
            open={saveModalOpen} onClose={() => setSaveModalOpen(false)} />
        <DeleteUserModal user={user} open={delModalOpen} onClose={() => setDelModalOpen(false) } />
        <div className="flex mb-5 justify-end">
            <div>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onSave} success disabled={!hasAnyChanges}>Save Changes</Button>
            </div>
        </div>
        <CollapsiblePanel defaultValue={true} title="Login &amp; Role">
            <div className="flex flex-col">
                <TextField outerLabelAbove label="E-mail Address" value={email} onChange={setEmail} className="mb-15" />
                <RoleDropdown className="mb-15" role={role} setRole={setRole} />
            </div>
        </CollapsiblePanel>
        <CollapsiblePanel defaultValue={true} title="Groups" className="mt-20">
            <div>Search for groups</div>
            <div>Group table</div>
        </CollapsiblePanel>
        <CollapsiblePanel defaultValue={true} title="Profile" className="mt-20">
            <div className="flex flex-col">
                <div className="flex">
                    <TextField outerLabelAbove label="First Name" className="flex-auto mr-5 mb-15"
                        value={firstName} onChange={setFirstName}
                    />
                    <TextField outerLabelAbove label="Last Name" className="flex-auto ml-5 mb-15"
                        value={lastName} onChange={setLastName}
                    />
                </div>
                <TextField outerLabelAbove label="Phone number" className="mt-5 mb-15"
                    value={phoneNumber} onChange={setPhoneNumber}
                />
                <TextField outerLabelAbove label="Company" className="mt-5 mb-15"
                    value={company} onChange={setCompany}
                />
                <TextField outerLabelAbove label="Country" className="mt-5 mb-15"
                    value={country} onChange={setCountry}
                />
            </div>
        </CollapsiblePanel>
        <div className="flex mt-20 justify-between">
            <Button onClick={onDelete} primary>Delete User</Button>
            <div>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onSave} success disabled={!hasAnyChanges}>Save Changes</Button>
            </div>
        </div>
    </>;
});