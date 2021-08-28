import { FC } from 'react';
import { Route, Switch } from 'react-router';
import { MeshList } from './MeshList';

// tslint:disable-next-line: variable-name
export const Meshes: FC<Props> = ({}) => (
    <Switch>
        <Route exact path="/:selectedGroupId/meshes/"><MeshList /></Route>
    </Switch>
);

interface Props {}
