import { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from '@/components/CC/404';
import { PartnersList } from './PartnersList';
import { PartnerPage } from './Partner';


// tslint:disable-next-line: variable-name
export const PartnerAdministration: FC<Props> = ({}) => {

    return <>
        <Switch>
            <Route exact path="/cc/admin/partners"><PartnersList /></Route>
            <Route exact path="/cc/admin/partners/:partnerId"><PartnerPage /></Route>
            <Route path="/cc/admin/partners/*"><NotFound /></Route>
        </Switch>
    </>;
};

interface Props {}
