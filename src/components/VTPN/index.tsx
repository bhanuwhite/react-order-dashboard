import './index.module.scss';
import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Footer } from './Footer';
import { TopBar } from './TopBar';
import { PlaceOrder } from './PlaceOrder';
import { MyOrders } from './MyOrders';
import { Order } from './MyOrders/Order';
import { UserBar } from './UserBar';


export const VTPN: FC<{}> = ({}) => (
<>
    <TopBar />
    <UserBar />
    <Switch>
        <Route path="/" exact><PlaceOrder /></Route>
        <Route path="/my-orders" exact><MyOrders /></Route>
        <Route path="/my-orders/:orderId" exact><Order /></Route>
    </Switch>
    <Footer />
</>
);