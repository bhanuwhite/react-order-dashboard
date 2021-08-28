import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { Link, useParams, useRouteMatch, Switch, Route } from 'react-router-dom';
import { HeadTitle, PageIntro, RoutedTabBar, Container, LinkTab } from '@/components/core';
import { useGroupsByIdFetcher } from '@/hooks/fetchers';
import { GroupInfo } from './GroupInfo';
import { GroupUsers } from './GroupUsers';
import { GroupCert } from './GroupCert';


// tslint:disable-next-line: variable-name
export const GroupPage: FC<Props> = observer(({}) => {

    const store = useStore();
    const groupId = useParams<{ groupId?: string }>().groupId ?? '';
    const { path } = useRouteMatch();
    const group = store.domain.groups.map.get(groupId);
    const name = group?.name ?? `Group ${groupId}`;
    const usersCount = group?.props.counts.users;
    const userHasVeeaSupportRole = store.view.activeuser.hasVeeaSupportPermissions;

    useGroupsByIdFetcher([groupId], { isInvalid: !groupId });

    return <>
        <HeadTitle>Veea Control Center - {name}</HeadTitle>
        <PageIntro title={name} icon="icon-3_Team_Management">
            <Link to="/cc/admin/groups"><i className="fas fa-chevron-left"></i>All Groups</Link>
        </PageIntro>
        <RoutedTabBar className="mt-15">
            <LinkTab to={`/cc/admin/groups/${groupId}/`}>Info</LinkTab>
            <LinkTab to={`/cc/admin/groups/${groupId}/users`}>Users {usersCount ? `(${usersCount})` : ''}</LinkTab>
            {userHasVeeaSupportRole && <LinkTab to={`/cc/admin/groups/${groupId}/certs`}>Certificate</LinkTab>}
        </RoutedTabBar>
        <Container solid className="p-10 lg:p-30">
            <Switch>
                <Route exact path={`${path}/users`}><GroupUsers groupId={groupId} /></Route>
                {userHasVeeaSupportRole && <Route exact path={`${path}/certs`}><GroupCert groupId={groupId} /></Route>}
                <Route path={path}><GroupInfo groupId={groupId} /></Route>
            </Switch>
        </Container>
    </>;
});

interface Props {}
