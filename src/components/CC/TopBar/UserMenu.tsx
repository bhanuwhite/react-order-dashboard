import * as React from 'react';
import { FC } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import styles from './UserMenu.module.scss';
import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';
import { createDiv } from '@/utils/dom';
import { logoutPrivafy } from '@/actions';
import { useUserPartnerIdFetcher } from '@/hooks/fetchers';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';


// tslint:disable-next-line: variable-name
export const UserMenu: FC<Props> = observer(({onClickOutside, onClickOption}) => {

    const store = useStore();
    const adminRights = store.view.activeuser.adminRights;
    const partnerId = store.view.activeuser.partnerId;
    const onboardingNeeded = store.view.activeuser.onboardingNeeded;
    const userHasPartnerAdminPermissions = store.view.activeuser.hasPartnerAdminFeature;
    // const userHasUserAdminPermissions = store.view.activeuser.hasUserAdminFeature;
    // const userHasGroupAdminPermissions = store.view.activeuser.hasGroupAdminFeature;
    const invitationsCount = store.domain.invitations.pendingCount;

    // Refresh partner id when user open the modal
    useUserPartnerIdFetcher(store.view.activeuser.authUserId);

    const [ menu ] = React.useState(createDiv);
    const ref = React.useRef<HTMLDivElement>(null);

    useOnClickOutside(ref, onClickOutside);

    React.useEffect(() => {
        const background: HTMLDivElement = document.createElement('div');
        background.className = styles.menuPopupBackgroundMenu;

        menu.setAttribute('style', 'position:fixed;top:0;left:0;width:100%;z-index:1000000');
        document.body.appendChild(menu);
        document.body.appendChild(background);

        return () => {
            document.body.removeChild(background);
            document.body.removeChild(menu);
        };
    }, [ menu, onClickOutside ]);

    function onClickWrapper(event: React.MouseEvent<HTMLAnchorElement>) {
        if (!event.defaultPrevented && // onClick prevented default
          event.button === 0) {
            onClickOption?.();
        }
    }

    async function logoutHandler(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();

        try {
            await logoutPrivafy();
        } catch (err) {
            console.error(err);
        }

        window.location.href = `/logout`;
        return;
    }

    return createPortal(
        <div ref={ref} className={`wrapper ${styles.userMenuWrapper}`}>
            <div data-qa-id="user-menu" className={styles.userMenu}>
                <Link to="/cc/account" onClick={onClickWrapper}>My Account</Link>
                {partnerId && <Link
                    to="/cc/applications"
                    onClick={onClickWrapper}>My Applications
                </Link>}
                <hr />
                {/* {(userHasUserAdminPermissions || userHasGroupAdminPermissions) && <>
                    <Link
                        to={`/cc/admin/${userHasUserAdminPermissions ? 'users' : 'groups'}`}
                        onClick={onClickWrapper}>
                            {userHasUserAdminPermissions ? 'Users' : ''}
                            {userHasUserAdminPermissions && userHasGroupAdminPermissions ? ' / ' : ''}
                            {userHasGroupAdminPermissions ? 'Groups' : ''}
                    </Link>
                    <hr />
                </>} */}
                <Link to="/cc/admin/groups" onClick={onClickWrapper}>
                    Groups
                </Link>
                <Link to="/cc/invites" onClick={onClickWrapper} className="flex justify-between">
                    <div>Invites</div>
                    <Badge count={invitationsCount} />
                </Link>
                <hr />
                {userHasPartnerAdminPermissions && <Link
                    to="/cc/admin/partners"
                    onClick={onClickWrapper}>Partners
                </Link>}
                {adminRights && !onboardingNeeded && <>
                    <Link
                        to="/cc/feature-preview"
                        onClick={onClickWrapper}>Feature Preview
                    </Link>
                    <Link
                        to="/cc/debug-options"
                        onClick={onClickWrapper}>Debug Options
                    </Link>
                    <hr />
                </>}
                <Link to="/cc/help" onClick={onClickWrapper}>Help Center</Link>
                <a onClick={logoutHandler} href="/logout">Logout</a>
            </div>
        </div>,
        menu,
    );
});


interface Props {
    onClickOutside?: () => void
    onClickOption?: () => void
}

// tslint:disable-next-line: variable-name
const Badge: FC<{ count: number }> = ({ count }) => (
    // tslint:disable-next-line: max-line-length
    <div className={`bkg-primary text-white pl-10 pr-10 font-bold ${count === 0 ? 'hidden' : ''}`} style={{ borderRadius: '10px' }}>
        {count}
    </div>
);