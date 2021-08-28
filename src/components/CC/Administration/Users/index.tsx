import { HeadTitle } from '@/components/core';
import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFoundBody } from '@/components/CC/404';
import { Users } from './Users';
import { User } from './User';
import { CreateUser } from './User/CreateUser';


// tslint:disable-next-line: variable-name
export const UsersAdministration: FC<{}> = () => (
    <>
        <HeadTitle>Veea Control Center - Users</HeadTitle>
        <Switch>
            <Route exact path="/cc/admin/users/"><Users /></Route>
            <Route exact path="/cc/admin/users/new"><CreateUser /></Route>
            <Route exact path="/cc/admin/users/:userId"><User /></Route>
            <Route path="/cc/admin/users/*">
                <NotFoundBody />
            </Route>
        </Switch>
    </>
);