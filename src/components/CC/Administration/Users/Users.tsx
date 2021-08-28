import * as styles from './index.module.scss';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { formatRole } from '@/utils/format';
import { PaginationButtons, Spinner, Nothing, Checkbox, LinkButton } from '@/components/core';
import { useStore } from '@/hooks/useStore';
import { useSearchUsersByPage } from '@/hooks/fetchers/groupservice-endpoints';
import { ErrorBox } from '@/components/core/Errors';
import { useQuery } from '@/hooks/useQuery';
import { UsersSearch } from './UsersSearch';
import { useSelectedStateForPaginatedData } from '@/hooks/useSelectedState';


// tslint:disable-next-line: variable-name
export const Users: FC<Props> = observer(({}) => {

    const store = useStore();
    const parentGroupsIds = store.view.activeuser.groups;
    const searchQuery = useQuery().get('search') ?? '';
    const {
        page,
        prev,
        next,
        hasNext,
        hasPrev,
        loading,
        error,
    } = useSearchUsersByPage(parentGroupsIds, searchQuery, 5, { isInvalid: false });
    const users = store.domain.users.getUsersForPage(page);
    const selectState = useSelectedStateForPaginatedData(page);
    const selectCount = selectState.count();

    function toggleAllUsers() {
        if (selectCount > 0) {
            selectState.deselectAll();
        } else {
            selectState.selectAllOnActivePage();
        }
    }

    return <>
        <div className="flex">
            <UsersSearch className="flex-1" />
        </div>
        <div className="flex justify-end mt-15">
            <div>
                <EditSelectedUsersButton />
                <NewUserButton />
            </div>
        </div>
        <div className={`${styles.usersTable} mt-15`}>
            <div className={styles.rowWrapper}>
                <HeaderCell>
                    <SelectRowToggle toggle={selectCount > 0}
                        indeterminate={!selectState.allSelected()}
                        setToggle={toggleAllUsers}
                    />
                </HeaderCell>
                <HeaderCell>Name</HeaderCell>
                <HeaderCell>Email</HeaderCell>
                <HeaderCell>Groups</HeaderCell>
                <HeaderCell>Role</HeaderCell>
                <HeaderCell>Status</HeaderCell>
            </div>
            {error ? <div className={styles.rowWrapper}>
                    <ErrorBox className={styles.errorBox}>{error.message}</ErrorBox>
                </div> : (
                loading && users.length === 0 ? <LoadingCell /> :
                    users.map((user, i) => <div className={styles.rowWrapper} key={i}>
                        <UserItemCell>
                            <SelectRowToggle toggle={selectState.isSelected(user.id)}
                                setToggle={(toggle) => selectState.toggle(user.id, toggle)}
                            />
                        </UserItemCell>
                        <UserItemCell linkTo={`/cc/admin/users/${user.id}`}>
                            {`${user.props.firstName} ${user.props.lastName}`}
                        </UserItemCell>
                        <UserItemCell>{user.props.email}</UserItemCell>
                        <UserItemCell>{user.props.counts?.groups ?? 0}</UserItemCell>
                        <UserItemCell>{formatRole(user.props.role!.name)}</UserItemCell>
                        <UserItemCell>{user.props.enabled ? 'Enabled' : 'Disabled'}</UserItemCell>
                    </div>)
            )}
            {!loading && users.length === 0 && <NoUsersFound />}
        </div>
        <PaginationButtons className="mt-15"
            prevPage={prev}
            nextPage={next}
            hasNext={hasNext}
            hasPrev={hasPrev}>
            {selectCount > 0 && <>
                {selectCount} row{selectCount > 1 ? 's' : ''} selected
            </>}
        </PaginationButtons>
    </>;
});

interface Props {}

// tslint:disable-next-line: variable-name
const HeaderCell: FC<{}> = ({ children }) => {
    return <div className={styles.headerCell}>
        {children}
    </div>;
};

// tslint:disable-next-line: variable-name
const UserItemCell: FC<{ linkTo?: string }> = ({ children, linkTo }) => {
    if (linkTo) {
        return <Link className={styles.userItemCell} to={linkTo} title={typeof children === 'string' ? children : ''}>
            {children}
        </Link>;
    } else {
        return <div className={styles.userItemCell} title={typeof children === 'string' ? children : ''}>
            {children}
        </div>;
    }
};

// tslint:disable-next-line: variable-name
const LoadingCell: FC<{}> = () => <div className={styles.rowWrapper}>
    <div className={styles.loadingCell}>
        <Spinner />
    </div>
</div>;

// tslint:disable-next-line: variable-name
const NoUsersFound: FC<{}> = () => <div className={styles.rowWrapper}>
    <Nothing className={styles.noUsersFound}>No users found</Nothing>
</div>;

// tslint:disable-next-line: variable-name
const NewUserButton: FC<{}> = () => (
    <LinkButton primary className={styles.createGroupButton} to="/cc/admin/users/new">
        <i className="fas fa-plus-circle mr-5" />
        Create User
    </LinkButton>
);

// tslint:disable-next-line: variable-name
const SelectRowToggle: FC<SelectRowToggleProps> = ({ toggle, setToggle, indeterminate }) => (
    <Checkbox checked={toggle} onClick={setToggle} indeterminate={indeterminate}
        className={styles.selectRowTogggle}
    />
);

interface SelectRowToggleProps {
    toggle: boolean
    setToggle: (toggle: boolean) => void
    indeterminate?: boolean
}

// tslint:disable-next-line: variable-name
const EditSelectedUsersButton: FC<{}> = () => (
    <></>
);