import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { Link } from 'react-router-dom';
import { Container } from './Container';


// tslint:disable-next-line: variable-name
export const UserBar: FC<Props> = observer(({}) => {

    const store = useStore();

    return <div className="border-b border-solid border-lighter-grey">
    <Container className="flex pt-15 pb-15 font-size-16">
        {store.view.activeuser.isLoggedIn && <div className="font-bold text-d-grey hidden md:block">
            Welcome back, {store.view.activeuser.firstName || 'Unknown user'}!
        </div>}
        <div className="flex-grow"></div>
        {store.view.activeuser.isLoggedIn ?
            <div className="flex">
                <a target="_blank" href="/controlcenter" className="no-underline hover:underline text-info hidden lg:block">
                    Visit Control Center
                </a>
                <form method="POST" action="/vtpn/manage-subscriptions">
                    <button type="submit" className="border-none bkg-none p-0 font-size-16 cursor-pointer no-underline hover:underline text-info ml-20">
                        Manage Payments
                    </button>
                </form>
                <Link to="/my-orders" className="no-underline hover:underline text-info ml-20">
                    View My Orders
                </Link>
                <a href="/logout" className="no-underline hover:underline text-info ml-20">
                    Logout
                </a>
            </div> :
            <div className="flex">
                <a href="/login" className="no-underline hover:underline text-info">
                    Login
                </a>
                <a href="/sign-up" className="no-underline hover:underline text-info ml-20">
                    Sign Up
                </a>
            </div>
        }
    </Container>
    </div>;
});

interface Props {}
