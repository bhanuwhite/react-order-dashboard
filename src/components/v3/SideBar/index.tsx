import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { FC } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { DropdownBox } from '../core';
import { Logo } from '../Logo';
import { useSelectedGroupId } from '@/hooks/useSelectedGroup';
import { useStore } from '@/hooks/useStore';
import { useGroupsByIdFetcher, useKeycloakAdminGetUserFetcher } from '@/hooks/fetchers';


/**
 * On mobile, this will be full screen
 * fixed,
 */

// tslint:disable-next-line: variable-name
export const SideBar: FC<Props> = observer(({ open, onClose }) => {

    const store = useStore();
    const selectedGroupId = useSelectedGroupId(store);
    const [ isVisible, setIsVisible ] = React.useState(open);

    React.useEffect(() => {
        if (!open && isVisible) {
            const timeoutId = setTimeout(() => {
                setIsVisible(false);
            }, 700);

            return () => clearTimeout(timeoutId);
        } else {
            setIsVisible(open);
        }
    }, [ open ]);

    const className = 'text-gray-500 transition-transform transform duration-700'
        // Mobile only classes
        + ' fixed top-0 left-0 bottom-0 w-5/6 z-50 dark:bg-gray-900 dark:text-gray-100 bg-white p-10 max-w-md overflow-y-scroll no-scrollbar'
        + (isVisible ? ' shadow-2xl' : '')
        // Open/on close behaviour
        + (open ? ' translate-x-0' : ' -translate-x-full')
        // Desktop only classes
        + ' lg:translate-x-0 lg:block lg:z-0 lg:sticky lg:top-24 lg:w-44 lg:mr-10 lg:flex-none dark:lg:bg-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:overflow-visible';

    return <>
        {isVisible && <div onClick={onClose}
            className={`lg:hidden fixed z-40 inset-0 transition-colors ${!open ? 'bg-transparent' : 'bg-black/50'}`} />
        }
        <div className={className}>
            <div className="lg:hidden mb-10 flex justify-between">
                <div className="font-normal flex items-center text-gray-500/80 dark:text-gray-100">
                    <Logo className="h-5 mr-4" />
                    Control Center
                </div>
                <button onClick={onClose} className="outline-none focus-visible:outline-black relative w-4">
                    <div className="right-0 w-4 h-0.5 dark:bg-gray-100 bg-gray-800 transform -rotate-45 absolute" />
                    <div className="right-0 w-4 h-0.5 dark:bg-gray-100 bg-gray-800 transform rotate-45 absolute" />
                </button>
            </div>
            <GroupSelection selectedGroupId={selectedGroupId} />
            <Separator />
            <SideBarLink onClick={onClose} className="mt-2" icon="icon-168_Home" exact to={`/${selectedGroupId}`}>
                Home
            </SideBarLink>
            <SideBarLink onClick={onClose} className="mt-0.5" icon="icon-166_Hierarchy"
                to={`/${selectedGroupId}/meshes`}
            >
                Meshes
            </SideBarLink>
            <SideBarLink onClick={onClose} className="mt-0.5" icon="icon-78_VeeaHub" to={`/${selectedGroupId}/devices`}>
                VeeaHubs
            </SideBarLink>
            <SideBarLink onClick={onClose} className="mt-0.5" icon="icon-67_Rocket" to="/subscriptions">
                Subscriptions
            </SideBarLink>
            <SideBarLink onClick={onClose} className="mt-0.5" icon="icon-16_Map" to="/locations">
                Locations
            </SideBarLink>
            <SideBarLink onClick={onClose} className="mt-0.5" icon="icon-64_Shield" to={`/${selectedGroupId}/privafy`}>
                vTPN
            </SideBarLink>
            <Separator className="mt-2" />
            <SideBarLink onClick={onClose} className="mt-2" icon="icon-7_Settings_Android" to="/settings">
                Settings
            </SideBarLink>
            <SideBarLink onClick={onClose} className="mt-0.5" icon="icon-6_Help" to="/help">
                Help
            </SideBarLink>
            <div className="lg:hidden mt-8 mb-8 space-y-4 text-xs text-gray-500 font-bold">
                <ExtLink href="https://www.veea.com/company/legal/terms-of-use/">Terms of Use</ExtLink>
                <ExtLink href="https://www.veea.com/company/legal/privacy-policy/">Privacy Policy</ExtLink>
                <ExtLink href="https://www.veea.com/company/legal/end-user-license-agreement/">EULA</ExtLink>
                <ExtLink href="https://www.veea.com/company/legal/warranty/">Limited Warranty</ExtLink>
                <ExtLink href="https://www.veea.com/company/legal/4g-failover-terms-of-use/">4G Failover Terms</ExtLink>
            </div>
            <div className="lg:hidden mt-8 space-y-4 text-xs text-gray-400">
                <div>
                    <p className="font-bold">
                        © 2018 - {new Date().getFullYear()} Veea Inc. All Rights Reserved.
                    </p>
                    <p>
                        VeeaHub is a trademarks of Veea Inc.{' '}
                        All other trademarks and tradenames are the property of their respective owners.
                    </p>
                </div>
                <div>Control Center Build {process.env.EC_VERSION}</div>
            </div>
        </div>
    </>;
});

interface Props {
    open: boolean
    onClose: () => void
}


// tslint:disable-next-line: variable-name
const Separator: FC<{ className?: string }> = ({ className }) => (
    <div className={`${className ?? ''} h-px bg-gray-300 w-full`} />
);

// tslint:disable-next-line: variable-name
const SideBarLink: FC<{ className?: string, exact?: boolean, to: string, icon: string, onClick: () => void }> = (
    { className, to, onClick, exact, icon, children },
) => (
    <NavLink activeClassName="text-veea" to={to} exact={exact} onClick={onClick}
        className={`pl-4 lg:hover:bg-gray-100 lg:active:bg-gray-200 lg:hover:text-gray-800 outline-none focus-visible:outline-black block ${className}`}
    >
        <i className={`text-2xl align-middle mr-2.5 ${icon}`} />
        {children}
    </NavLink>
);

// tslint:disable-next-line: variable-name
const ExtLink: FC<{ href: string }> = ({ href, children }) => (
    <a href={href} className="block no-underline outline-none focus-visible:outline-black hover:underline" rel="noopener" target="_blank">{children}</a>
);


// tslint:disable-next-line: variable-name
const GroupSelection: FC<{ selectedGroupId: string }> = observer(({ selectedGroupId }) => {

    const store = useStore();
    const history = useHistory();
    const groupIds = store.view.activeuser.groups;
    const { loading } = useGroupsByIdFetcher(groupIds, { isInvalid: groupIds.length <= 1 });
    const { pathname } = history.location;

    const oldPrefix = `/${selectedGroupId}`;

    // If the id is not found we navigate to the home screen.
    let prevPath = '';
    if (oldPrefix === pathname.slice(0, oldPrefix.length)) {
        // We preserve the location. This might not work if the user is looking
        // at a specific mesh or device. But it means changing the context is
        // not destructive (although they should be able to use the browser navigation
        // to go back)
        prevPath = pathnameRedirect(pathname.slice(oldPrefix.length));
    }

    const links = groupIds.map(gid => ({
        name: store.domain.groups.map.get(gid)?.name ?? (loading ? 'Loading...' : 'Unknown group'),
        id: gid,
        link: `/${gid}${prevPath}`,
        contactId: store.domain.groups.map.get(gid)?.props.contactId ?? null,
    }));
    const selectedGroup = store.domain.groups.map.get(selectedGroupId)?.name ?? (loading ? 'Loading...' : 'Unknown group');

    return <DropdownBox selectedEntry={selectedGroup}
        btnClassName="border-transparent hover:bg-gray-100"
        dropdownContentClassName="max-h-36 overflow-y-scroll"
    >
        {links.map(l => <GroupLink key={l.id} active={selectedGroupId === l.id} {...l} />)}
    </DropdownBox>;
});

// tslint:disable-next-line: variable-name
const GroupLink: FC<GroupLinkProps> = observer(({ link, name, contactId, active }) => {

    const userId = contactId ?? '';

    const store = useStore();
    useKeycloakAdminGetUserFetcher(userId);
    const user = store.domain.users.map.get(userId);

    return <NavLink key={link} className="w-full focus-visible:outline-black py-2 px-4 hover:text-primary flex justify-between items-center outline-none hover:bg-primary-light/10"
        to={link} activeClassName=""
    >
        <div className="grid flex-1">
            <div className="text-black" style={{ overflowWrap: 'anywhere' }}>{name}</div>
            {user && <div className="text-xs text-gray-400 truncate">{user.props.email}</div>}
        </div>
        {active && <i className="fas fa-check-circle text-primary relative -right-1 flex-none"/>}
    </NavLink>;
});

interface GroupLinkProps {
    link: string
    name: string
    contactId: string | null
    active: boolean
}

function pathnameRedirect(pathname: string): string {

    if (pathname.startsWith('/meshes')) {
        return '/meshes';
    } else if (pathname.startsWith('/devices')) {
        return '/devices';
    }
    return pathname;
}
