import * as React from 'react';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { minutes } from '@/utils/units';
import { useUserPartnerIdFetcher, useInvitationsFetcher } from '@/hooks/fetchers';
import { UserMenu } from './UserMenu';
import styles from './MenuItem.module.scss';


// tslint:disable-next-line: variable-name
export const MenuItem: FC<Props> = ({ to, icon, title, exact }) => {
    const marginLeft = title === 'Home' ? 'ml-0 md:ml-15' : title === 'vTPN Control Center' ? 'ml-5' : 'ml-0';
    return <NavLink to={to} activeClassName="selected" className={`no-underline ${marginLeft}`} exact={exact}>
        <div data-qa-component="menu-item" className={`w-40 h-40 rounded-100 flex justify-center items-center group relative ${styles.menuItem}`}>
            <i className={`w-20 h-20 font-size-20 text-white opacity-70 group-hover-opacity-100 ${icon}`}/>
            <div className={`${styles.menuItemText} hidden group-hover:block absolute text-white -bottom-34 left-20 w-auto bkg-black text-center pt-5 pb-5 pl-15 pr-15 font-size-12 rounded-70 whitespace-nowrap`}>{title}</div>
        </div>
    </NavLink>;
};

interface Props {
    to: string
    icon: string
    title: string
    exact?: boolean
}


// tslint:disable-next-line: variable-name
export const MenuItemProfile: FC<ProfileProps> = observer(({}) => {

    const store = useStore();
    const [open, setOpen] = React.useState(false);

    const closeModal = React.useCallback(() => setOpen(false), [ setOpen ]);

    // Refresh partner id while user is on the application page every 15 minutes
    useUserPartnerIdFetcher(store.view.activeuser.authUserId, { pollInterval: minutes(15) });

    // Fetch invitations
    useInvitationsFetcher({ pollInterval: minutes(10) });

    const invitationsCount = store.domain.invitations.pendingCount;

    return <>
        <NavLink  className="ml-auto" to="/cc/account/" activeClassName="selected" id="user-menu-button"
            onClick={(ev) => {
                setOpen(!open);
                ev.preventDefault();
            }}
        >
            <div className={`h-40 rounded-100 relative pl-10 pr-60 ${open ? `${styles.chevronUp} bkg-white rounded-none` : styles.chevronDown}`}>
                {/* <img style={{ height: 32, width: 32 }} src={`${ASSETS_IMAGES_FOLDER}/topbar/defaultAvatar.png`} 
                    className="h-full w-full rounded-16 border-2 border-solid border-white absolute top-4 right-4" />*/}
                {invitationsCount > 0 && !open && <div className="circle-10 bkg-success border-solid border-2 border-white absolute bottom-4 right-4" />}
            </div>
        </NavLink>
        {open ? <UserMenu onClickOption={closeModal} onClickOutside={closeModal} /> : null}
    </>;
});
interface ProfileProps {

}