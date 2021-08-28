import * as React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { FetchError } from '@/fetcher';
import { Button, Nothing, Spinner } from '@/components/core';
import { ErrorBox } from '@/components/core/Errors';
import { GroupState, GroupPathElement } from '@/store/domain/groups';
import { useStore } from '@/hooks/useStore';
import styles from './GroupsTable.module.scss';
import { useKeycloakAdminGetUserFetcher } from '@/hooks/fetchers';
import { JoinGroupModal } from './Group/Modals/JoinGroupModal';
import { USER_GROUPS_LIMIT } from '@/consts/groups';


// tslint:disable-next-line: variable-name
export const GroupsTable: FC<Props> = observer(({ groups, loading, error, className, children, refreshGroupList }) => {

    const store = useStore();
    const [ joinGroupOpen, setJoinGroupOpen ] = React.useState(false);
    const [ groupIdToJoin, setGroupIdToJoin ] = React.useState('');
    const omittedGroupIds = store.view.activeuser.omittedGroupIds;

    className = className ?? '';

    function filterOutOmittedGroupIds(groupItemBreadcrumb: GroupPathElement) {
        return !omittedGroupIds.includes(groupItemBreadcrumb.id);
    }

    function getExplodedPathFromBreadcrumbs(groupItemBreadcrumbs: GroupPathElement[]) {
        return groupItemBreadcrumbs
            .filter(filterOutOmittedGroupIds)
            .map(({ displayName }) => displayName);
    }

    return <div className={`${styles.groupsTable} ${className}`}>
        <JoinGroupModal groupId={groupIdToJoin} refreshUsersList={refreshGroupList}
            open={joinGroupOpen} onClose={() => setJoinGroupOpen(false)}
        />
        <div className={styles.rowWrapper}>
            <HeaderCell>Name</HeaderCell>
            <HeaderCell>Contact</HeaderCell>
            <HeaderCell>Path</HeaderCell>
            <HeaderCell>Subgroups</HeaderCell>
            <HeaderCell>Users</HeaderCell>
            <HeaderCell>Meshes</HeaderCell>
            <HeaderCell>VeeaHubs</HeaderCell>
            <HeaderCell></HeaderCell>
        </div>
        {error ? <div className={styles.rowWrapper}>
                <ErrorBox className={styles.errorBox}>{error.message}</ErrorBox>
            </div> : (
            loading && groups.length === 0 ? <LoadingCell /> :
                groups.map((group, i) => {

                    const joined = store.view.activeuser.groups.includes(group.id);
                    const limitReached = store.view.activeuser.groups.length >= USER_GROUPS_LIMIT;

                    function onClickJoin() {
                        setGroupIdToJoin(group.id);
                        setJoinGroupOpen(true);
                    }

                    return <div className={styles.rowWrapper} key={i}>
                        <GroupItemCell groupUrlPath={`/cc/admin/groups/${group.id}`}>
                            {group.name}
                        </GroupItemCell>
                        <GroupItemCell>
                            <GroupContact contactId={group.props.contactId} />
                        </GroupItemCell>
                        <GroupItemCell>
                            {`/ ${getExplodedPathFromBreadcrumbs(group.props.path).join(' / ')}`}
                        </GroupItemCell>
                        <GroupItemCell>{group.props.counts.children}</GroupItemCell>
                        <GroupItemCell>{group.props.counts.users}</GroupItemCell>
                        <GroupItemCell>{group.props.counts.meshes}</GroupItemCell>
                        <GroupItemCell>{group.props.counts.devices}</GroupItemCell>
                        <GroupItemCell className="p-0 flex items-center">
                            <Button className="m-0 pt-5 pb-5" inversed success
                                disabled={joined || limitReached}
                                onClick={onClickJoin}
                            >
                                {
                                    joined ? 'Joined' :
                                    limitReached ? 'Limit reached' :
                                    'Join'
                                }
                            </Button>
                        </GroupItemCell>
                    </div>;
                })
        )}
        {!loading && groups.length === 0 && <NoGroupsFound>{children}</NoGroupsFound>}
    </div>;
});

interface Props {
    groups: GroupState[]
    loading: boolean
    error: FetchError | undefined
    refreshGroupList: () => void
    className?: string
}

// tslint:disable-next-line: variable-name
const HeaderCell: FC<{}> = ({ children }) => {
    return <div className={styles.headerCell}>
        {children}
    </div>;
};

// tslint:disable-next-line: variable-name
const GroupItemCell: FC<GroupItemCellProps> = ({ children, className, groupUrlPath }) => {
    className = className ?? '';
    if (groupUrlPath) {
        return <Link className={`${styles.groupItemCell} ${className}`} to={groupUrlPath} title={typeof children === 'string' ? children : ''}>
            {children}
        </Link>;
    } else {
        return <div className={`${styles.groupItemCell} ${className}`} title={typeof children === 'string' ? children : ''}>
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
const NoGroupsFound: FC<{}> = ({ children }) => <div className={styles.rowWrapper}>
    <Nothing raw className={styles.noGroupsFound}>{children}</Nothing>
</div>;

interface GroupItemCellProps {
    groupUrlPath?: string
    className?: string
}

// tslint:disable-next-line: variable-name
const GroupContact: FC<{ contactId?: string | null }> = observer(({ contactId }) => {

    const userId = contactId ?? '';

    const store = useStore();
    const { loading } = useKeycloakAdminGetUserFetcher(userId);
    const user = store.domain.users.map.get(userId);

    return contactId !== null ? (
            user ?
            <span>{user.name} <span className="font-size-14 text-grey">({user.props.email})</span></span> :
            loading ?
            <span>Loading...</span> :
            <span className="italic text-grey font-size-14">
                <i className="fas fa-exclamation-triangle align-middle mr-10"/>
                <span className="align-middle">User not found</span>
            </span>
    ) : <span className="italic text-light-grey">No contact set</span>;
});