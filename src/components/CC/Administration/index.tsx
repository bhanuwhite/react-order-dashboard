import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Switch, Route } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { PartnerAdministration } from './Partners';
import { GroupsAdministration } from './Groups';
import { NotFound } from '../404';


// tslint:disable-next-line: variable-name
export const Administration: FC<Props> = observer(({}) => {
    const store = useStore();
    const userHasPartnerAdminPermissions = store.view.activeuser.hasPartnerAdminFeature;

    return <Switch>
        {userHasPartnerAdminPermissions && <Route path="/cc/admin/partners">
            <PartnerAdministration />
        </Route>}
        <Route path="/cc/admin/groups">
            <GroupsAdministration />
        </Route>
        <Route path="/cc/admin/*"><NotFound /></Route>
    </Switch>;
});

interface Props {}