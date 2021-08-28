import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { useStore } from '@/hooks/useStore';
import { GrayContainer } from '../core';


// tslint:disable-next-line: variable-name
export const Account: FC<Props> = observer(({}) => {

    const store = useStore();
    const name = store.view.activeuser.name;
    const email = store.view.activeuser.email;

    const cpn = window.location.pathname;

    return <>
        <GrayContainer className="p-6 flex flex-col justify-center items-center">
            <div className="rounded-full bg-gray-200 w-16 h-16 flex justify-center items-center">
                <i className="text-4xl text-gray-400 fas fa-user-ninja"/>
            </div>
            <h2 className="text-lg font-medium mt-3">{name}</h2>
            <h3 className="text-gray-400">{email}</h3>
        </GrayContainer>
        <AccountLink action="Change Password"
            to={`/account/change-password?redirectPath=${cpn}%23/settings/account/`}
            actionClassName="text-primary"
        >
            Secure your account by periodically changing your password
        </AccountLink>
        <AccountLink action="View Sessions"
            to={`/account/view-sessions?redirectPath=${cpn}%23/settings/account/`}
            actionClassName="text-primary"
        >
            View sessions you have open on other devices
        </AccountLink>
        <AccountLink action="Logout" icon="icon-12_Logout"
            to="/logout"
            actionClassName="text-bad"
        >
            Log out of this device
        </AccountLink>
    </>;
});

interface Props {}

// tslint:disable-next-line: variable-name
const AccountLink: FC<AccountLinkProps> = ({
    to,
    icon,
    action,
    actionClassName,
    children,
}) => (
<GrayContainer className="p-6 mt-4 flex items-center">
    <div className="hidden relative md:inline-block w-10">
        <i className={`absolute left-0 transform -translate-y-1/2 text-3xl w-10 ${icon}`}/>
    </div>
    <div className="flex-grow hidden sm:block text-sm md:text-base mx-3">
        {children}
    </div>
    <a className={`font-medium hover:underline whitespace-nowrap ${actionClassName}`} href={to}>{action}</a>
</GrayContainer>
);

interface AccountLinkProps {
    to: string
    icon?: string
    action: React.ReactNode
    actionClassName: string
}