import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router';
import { useStore } from '@/hooks/useStore';
import { USER_NOT_LOGGED_IN, SESSION_EXPIRED, VERSION_MISMATCHED } from '@/consts';
import * as style from './index.module.scss';


// tslint:disable-next-line: variable-name
export const RefreshPageInvite: FC<{}> = observer(({}) => {

    const store = useStore();
    const { pathname } = useLocation();
    const inviteToRefreshPage = store.view.activeuser.inviteToRefreshPage;
    const reason = store.view.activeuser.inviteToRefreshPageReason;

    if (inviteToRefreshPage) {
        const refreshLocation = `#${pathname}`;
        const redirectloginLocation = `/login?prevLocation=${encodeURIComponent(pathname)}`;
        switch (reason) {
            case SESSION_EXPIRED:
            case USER_NOT_LOGGED_IN:
                window.location.href = redirectloginLocation;
                return null;
            case VERSION_MISMATCHED:
                return <div className={style.statusBar}><span>
                    A newer version of Control Center is available!{' '}
                    Please <a href={refreshLocation} onClick={refreshPage}>
                        refresh
                    </a> the page to get the latest version.
                </span></div>;
            default:
                return <div className={style.statusBar}><span>
                    You need to refresh the page. <a href={refreshLocation} onClick={refreshPage}>Refresh now.</a>
                </span></div>;
        }
    }

    return null;
});

function refreshPage() {
    window.location.reload();
}