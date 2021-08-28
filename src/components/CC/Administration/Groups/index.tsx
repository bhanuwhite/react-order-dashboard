import { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from '@/components/CC/404';
import { GroupsHome } from './GroupsHome';
import { GroupPage } from './Group';


// tslint:disable-next-line: variable-name
export const GroupsAdministration: FC<Props> = ({}) => {

    return <>
        <Switch>
            <Route exact path="/cc/admin/groups"><GroupsHome /></Route>
            <Route path="/cc/admin/groups/:groupId"><GroupPage /></Route>
            <Route path="/cc/admin/groups/*"><NotFound /></Route>
        </Switch>
    </>;
};

interface Props {}
