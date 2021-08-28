import { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from '@/components/CC/404';
import { ACLList } from './ACLList';
import { ACL } from './ACL';
import { HeadTitle } from '@/components/core';


// tslint:disable-next-line: variable-name
export const ACLAdministration: FC<Props> = ({}) => (
    <>
        <HeadTitle>Veea Control Center - Testing Teams</HeadTitle>
        <Switch>
            <Route exact path="/cc/applications/testing-teams"><ACLList /></Route>
            <Route exact path="/cc/applications/testing-teams/:aclId"><ACL /></Route>
            <Route path="/cc/applications/testing-teams/*"><NotFound /></Route>
        </Switch>
    </>
);

interface Props {}
