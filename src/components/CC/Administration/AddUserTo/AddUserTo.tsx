import * as React from 'react';
import { FC } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { ActionModal, Button, Nothing, SearchBar, Spinner } from '@/components/core';
import { ErrorBox } from '@/components/core/Errors';
import { useStore } from '@/hooks/useStore';
import { useKeycloakAdminSearchUsersByPage } from '@/hooks/fetchers';
import { UserState } from '@/store/domain/users';
import * as styles from './AddUserTo.module.scss';
import { RequestResult } from '@/actions/helpers';
import { isEmailValid } from '@/utils/email-valid';


// tslint:disable-next-line: variable-name
export const AddUserTo: FC<Props & AllowAddOnEmptyResultProps> = observer(({
    open,
    onClose,
    name,
    emailOnly,
    hasUser,
    refresh,
    userDescriptiveName = 'user',
    addText = 'Add',
    addedText = 'Added',
    children,
    ...allowAdd
}) => {

    // Email only is always true if allowAddOnEmptyResult is true
    emailOnly = emailOnly || allowAdd.allowAddOnEmptyResult;

    const store = useStore();
    const [ search, setSearch ] = React.useState('');
    const [ searchQuery, setSearchQuery ] = React.useState('');
    const [ lastAddError, setAddError ] = React.useState('');
    const {
        loading,
        error,
        page,
    } = useKeycloakAdminSearchUsersByPage(search, emailOnly);
    const searchRef = React.useRef<HTMLInputElement>(null);
    const users = store.domain.users.getUsersForPage(page);

    React.useEffect(() => {
        if (!open) {
            setSearch('');
            setSearchQuery('');
            setAddError('');
        } else {
            searchRef.current?.focus();
        }
    }, [ open ]);

    const [ beingAdded ] = React.useState(() => observable.set<string>());

    async function onAdd(user: UserState) {

        const veeaUserId = user.props.veeaUserId;
        if (!veeaUserId) {
            setAddError(`${user.props.email || user.props.username} doesn't have a veea user id`);
            return;
        }

        action(() => beingAdded.add(user.id))();
        const res = await allowAdd.addUserToEntity(user, user.props.email);
        if (!res.success) {
            setAddError(res.message);
        } else {
            await refresh();
        }
        action(() => beingAdded.delete(user.id))();
    }

    async function onAddEmailIfNoData(email: string) {

        //
        // We do a type assertion here because we assume this code will only be called
        // when `allowAdd.allowAddOnEmptyResult` is true.
        //
        // If `allowAdd.allowAddOnEmptyResult` is true, undefined is an acceptable
        // value for the first argument of `addUserToEntity`
        //
        // Because TypeScript has correctly computed the type of `addUserToEntity`
        // to be:
        //      (user: UserState | undefined, userEmail: string) => Promise<RequestResult<unknown>>
        //    | (user: UserState) => Promise<RequestResult<unknown>>
        //
        // The only legal way to call that function that satisfies both variant is to call
        // it as if it had the following type:
        //
        //      (user: UserState, userEmail: string) => Promise<RequestResult<unknown>>
        //
        // That explains the type error we get if we remove the assert.
        //
        assertAllowAddOnEmptyResultIsTrue(allowAdd);

        action(() => beingAdded.add(email))();
        const res = await allowAdd.addUserToEntity(undefined, email);
        if (!res.success) {
            setAddError(res.message);
        } else {
            await refresh();
        }
        action(() => beingAdded.delete(email))();
    }

    function doSearch() {
        setSearch(searchQuery);
        setAddError('');
    }

    return <ActionModal extended centered open={open} onClose={onClose} actions={[]} cancelBtnText="Close">
        <h1>Add a {userDescriptiveName} to {name}</h1>
        <h2>You can find and add {userDescriptiveName}s by searching them {!emailOnly ? 'by name or' : 'by'} email</h2>
        <SearchBar ref={searchRef} className="mt-10 m-auto max-width-500" buttonClassName="pl-25 pr-25" info
            doSearch={doSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <hr/>
        <div>
            {error ? <ErrorBox className="m-auto max-width-500 mb-10">{error.message}</ErrorBox> : null}
            {lastAddError ? <ErrorBox className="m-auto max-width-500 mb-10">{lastAddError}</ErrorBox> : null}
            {search === '' ? null :
                loading && users.length === 0 ? <Spinner /> :
                !error && users.length === 0 ? (

                    allowAdd.allowAddOnEmptyResult ?
                        <div className="max-width-500 m-auto">
                            <div className={`${styles.userList} p-10`}>
                                <AddEmailAction pending={beingAdded.has(search)} hasEmail={allowAdd.hasEmail}
                                    addText={addText}
                                    addedText={addedText}
                                    onAdd={onAddEmailIfNoData}
                                    email={search}
                                />
                            </div>
                            {allowAdd.additionalInfo}
                        </div> :
                        <Nothing className="m-auto max-width-500">
                            No {userDescriptiveName}s found
                        </Nothing>
                ) :
                <div className={`${styles.userList} max-width-500 p-10 m-auto`}>
                    {users.map(user =>
                        <AddUserAction pending={beingAdded.has(user.id)} hasUser={hasUser}
                            addText={addText}
                            addedText={addedText}
                            onAdd={onAdd}
                            user={user}
                            key={user.id}
                        />,
                    )}
                </div>
            }
        </div>
    </ActionModal>;
});

interface Props {
    /** True if the modal should be opened */
    open: boolean
    /** Called when the modal is closed */
    onClose: () => void
    /** Name of the ACL or Partner receiving new users */
    name: string
    /** Set this to true if we should expect only one result and search is only allowed by email */
    emailOnly?: boolean
    /** Returns true if the ACL or Partner already has the user */
    hasUser: (user: UserState) => boolean
    /** Ideally should refresh the list of users on the entity */
    refresh: () => Promise<void>
    /** What the content should display to describe a user. Defaults to "user" */
    userDescriptiveName?: string
    /** What the action text to add a user should be. defaults to "Add"  */
    addText?: string
    /** What the action text of a added user should be. defaults to "Added"  */
    addedText?: string
}

type AllowAddOnEmptyResultProps = AcceptEmail | OnlyUsersInKeycloak;
interface AcceptEmail {
    /** Set this to true if we should call addUserToEntity even if the user wasn't found (implies emailOnly) */
    allowAddOnEmptyResult: true
    /** Used to check if the email has been already added to the entity */
    hasEmail: (email: string) => boolean
    /** Add user to the ACL or Partner or any entity that has a list of veea id users */
    addUserToEntity: (user: UserState | undefined, userEmail: string) => Promise<RequestResult<unknown>>
    /** Additional details to render below the add email button */
    additionalInfo?: React.ReactNode
}
interface OnlyUsersInKeycloak {
    allowAddOnEmptyResult?: false
    /** Add user to the ACL or Partner or any entity that has a list of veea id users */
    addUserToEntity: (user: UserState) => Promise<RequestResult<unknown>>
}

// tslint:disable-next-line: variable-name
const AddUserAction: FC<AddUserActionProps> = observer(({ user, onAdd, pending, hasUser, addText, addedText }) => {

    const added = hasUser(user);
    const email = user.props.email;

    return <div className="flex ml-15 mr-15 items-center">
        <div className="truncate flex-1 text-left mr-10">
            <span>{user.name}</span>
            {email ?
                <span className="text-grey ml-10 font-size-14" title={user.props.email}>({user.props.email})</span> :
                null}
        </div>
        <Button style={{ width: '98px' }} disabled={added || pending} success onClick={() => onAdd(user)}>
            {pending ? <Spinner className="p-0" /> :
                added ? addedText : <><i className="fas fa-plus mr-10"/>{addText}</>
            }
        </Button>
    </div>;
});

interface AddUserActionProps {
    user: UserState
    hasUser: (user: UserState) => boolean
    onAdd: (user: UserState) => void
    pending: boolean
    addText: string
    addedText: string
}

// tslint:disable-next-line: variable-name
const AddEmailAction: FC<AddEmailActionProps> = ({ email, hasEmail, onAdd, pending, addText, addedText }) => {

    const added = hasEmail(email);
    const emailValid = isEmailValid(email);

    return <div className="flex ml-15 mr-15 items-center">
        <div className="truncate flex-1 text-left mr-10">
            <span className={!emailValid ? 'text-primary' : ''}>{email}</span>
            {!emailValid && <span className="ml-10 italic font-size-14 text-primary">(email is not valid)</span>}
        </div>
        <Button style={{ width: '98px' }} disabled={added || pending || !emailValid} success
            onClick={() => onAdd(email)} title={emailValid ? '' : 'This email address is not valid'}
        >
            {pending ? <Spinner className="p-0" /> :
                added ? addedText : <><i className="fas fa-plus mr-10"/>{addText}</>
            }
        </Button>
    </div>;
};

interface AddEmailActionProps {
    email: string
    hasEmail: (email: string) => boolean
    onAdd: (email: string) => void
    pending: boolean
    addText: string
    addedText: string
}

function assertAllowAddOnEmptyResultIsTrue(val: AllowAddOnEmptyResultProps): asserts val is AcceptEmail {
    if (process.env.NODE_ENV === 'development') {
        if (!val.allowAddOnEmptyResult) {
            throw new Error('Bug found in AddUserToComponent!');
        }
    }
}