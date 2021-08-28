import * as React from 'react';
import { FC } from 'react';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';
import { NavLink, useHistory } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { useGroupsByIdFetcher, useKeycloakAdminGetUserFetcher } from '@/hooks/fetchers';
import { createDiv } from '@/utils/dom';
import styles from './UserMenu.module.scss';
import { useOnClickOutsideManyRefs } from '@/hooks/useOnClickOutside';


// tslint:disable-next-line: variable-name
export const GroupSelection: FC<Props> = observer(({ selectedGroupId }) => {
    const store = useStore();
    const groupIds = store.view.activeuser.groups;
    const { loading } = useGroupsByIdFetcher(groupIds, { isInvalid: groupIds.length <= 1 });
    const [ open, setOpen ] = React.useState(false);
    const closeModal = React.useCallback(() => setOpen(false), [ setOpen ]);
    const [ width, setWidth ] = React.useState(0);
    const divRef = React.useRef<HTMLDivElement | null>(null);
    const dropdownRef = React.useRef<HTMLDivElement | null>(null);

    React.useLayoutEffect(() => {
        if (divRef.current) {
            setWidth(divRef.current.clientWidth);
        }
    }, [divRef.current, open]);

    useOnClickOutsideManyRefs(closeModal, dropdownRef, divRef);

    function onOpenDropdown() {
        setOpen(!open);
    }

    if (groupIds.length <= 1) {
        return null;
    }

    const bkgText = open ? 'bkg-white' : 'bkg-darken-22 text-white';
    const icon = open ? 'fa-chevron-up' : 'fa-chevron-down text-white';

    return <div ref={divRef} className="h-full flex flex-grow items-center mr-5 ml-15 relative cursor-pointer"
        style={{ flexBasis: '100px' }}
    >
        <i className={`${icon} fas absolute font-size-10 left-10 pointer-events-none`} style={{ zIndex: 1 }} />
        <div className={`${bkgText} flex items-center absolute w-full border border-transparent border-solid rounded-6 pl-25 h-35`}
            onClick={onOpenDropdown}
        >
            {open ?
                <div className="truncate font-size-12-5">
                    Select a group...
                </div> :
                <div className="truncate font-size-14">
                    {store.domain.groups.map.get(selectedGroupId)?.name ?? (loading ? 'Loading...' : 'Unknown group')}
                </div>
            }
        </div>
        {open ?
            <GroupSelectionDropDown width={width} selectedGroupId={selectedGroupId}
                dropdownRef={dropdownRef}
                onClickGroupId={closeModal}
                onClickOutside={closeModal}
            /> :
            null
        }
    </div>;
});

interface Props {
    selectedGroupId: string
}

function pathnameRedirect(pathname: string): string {

    if (pathname.startsWith('/devices/mesh')) {
        return '/devices/meshes';
    } else if (pathname.startsWith('/devices/device')) {
        return '/devices/devices';
    }
    return pathname;
}

// tslint:disable-next-line: variable-name
const GroupSelectionDropDown: FC<GroupSelectionDropDownProps> = observer(({
    width,
    selectedGroupId,
    dropdownRef,
    onClickGroupId,
}) => {

    const store = useStore();
    const history = useHistory();
    const [ menu ] = React.useState(createDiv);
    const { pathname, search } = history.location;
    const groupIds = store.view.activeuser.groups;

    const oldPrefix = `/cc/${selectedGroupId}`;

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
        name: store.domain.groups.map.get(gid)?.name ?? 'Unknown group',
        link: `/cc/${gid}${prevPath}${search}`,
        contactId: store.domain.groups.map.get(gid)?.props.contactId ?? null,
    }));

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
    }, [ menu ]);

    return createPortal(
        <div ref={dropdownRef} className={`wrapper ${styles.userMenuWrapper}`}>
            <div style={{
                top: '42px',
                right: '75px',
                width: `${width}px`,
                height: '10px',
                backgroundColor: 'white',
                position: 'absolute',
            }}></div>
            <div className={styles.userMenu} style={{
                top: '50px',
                right: '75px',
                width: `${width}px`,
                minWidth: '200px',
                maxHeight: '200px',
                overflowY: 'auto',
            }}>
                {links.map(({ name, link, contactId }) =>
                    <GroupLink key={link} contactId={contactId} name={name} link={link} onClick={onClickGroupId} />,
                )}
            </div>
        </div>,
        menu,
    );
});

interface GroupSelectionDropDownProps {
    width: number
    selectedGroupId: string
    dropdownRef: React.RefObject<HTMLDivElement>
    onClickOutside: () => void
    onClickGroupId: () => void
}

// tslint:disable-next-line: variable-name
const GroupLink: FC<GroupLinkProps> = ({ link, name, contactId, onClick }) => {

    const userId = contactId ?? '';

    const store = useStore();
    useKeycloakAdminGetUserFetcher(userId);
    const user = store.domain.users.map.get(userId);

    return <NavLink key={link} className="pl-25 flex flex-col group" activeClassName={styles.active}
        to={link} onClick={onClick}
    >
        <div style={{ overflowWrap: 'anywhere' }}>{name}</div>
        {user && <div className="text-grey group-hover:text-white font-size-12 truncate">{user.props.email}</div>}
    </NavLink>;
};

interface GroupLinkProps {
    link: string
    name: string
    contactId: string | null
    onClick: () => void
}