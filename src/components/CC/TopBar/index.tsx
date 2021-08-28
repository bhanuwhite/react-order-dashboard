import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useSelectedGroupId } from '@/hooks/useSelectedGroup';
import { useStore } from '@/hooks/useStore';
import { MenuItem, MenuItemProfile } from './MenuItem';
import { VerticalSeparator } from './VerticalSeparator';
import { Search } from './Search';
import { PaddingTop } from './PaddingTop';
import { GroupSelection } from './GroupSelection';


// tslint:disable-next-line: variable-name
export const TopBar: FC<Props> = observer(({}) => {

    const store = useStore();
    const selectedGroupId = useSelectedGroupId(store);

    return <div className="fixed top-0 left-0 w-full h-60 bkg-primary" style={{ zIndex: 10000 }} data-qa-id="topbar-menu">
        <PaddingTop />
        <div className="wrapper flex">
            <Link to={`/cc/${selectedGroupId}`} className="text-white group no-underline h-30 w-180 font-light font-size-19 whitespace-nowrap hidden md:block" style={{ marginTop: 19 }}>
                <b className="font-size-25">veea</b>
                <span style={{ letterSpacing: -0.5 }}
                    className="opacity-50 group-hover-opacity-100"
                > Control Center</span>
            </Link>
            {
                store.view.activeuser.onboardingNeeded ?
                <div className="flex-grow items-center flex h-60 md:ml-20">
                    <MenuItemProfile />
                </div> :
                <div className="flex-grow items-center flex h-60 md:ml-20">
                    <Search selectedGroupId={selectedGroupId} />
                    <MenuItem exact to={`/cc/${selectedGroupId}`} title="Home" icon="icon-168_Home" />
                    <VerticalSeparator />
                    <MenuItem to={`/cc/${selectedGroupId}/devices/meshes`} title="VeaaHubs" icon="icon-78_VeeaHub" />
                    <MenuItem to={`/cc/${selectedGroupId}/privafy`} title="vTPN Control Center" icon="icon-privafy" />
                    <VerticalSeparator />
                    <MenuItem to="/cc/help/" title="Help Center" icon="icon-6_Help" />
                    <VerticalSeparator />
                    <GroupSelection selectedGroupId={selectedGroupId} />
                    <MenuItemProfile />
                </div>
            }
        </div>
    </div>;
});
interface Props {}