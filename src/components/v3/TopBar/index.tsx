import { FC } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useSelectedGroupId } from '@/hooks/useSelectedGroup';
import { useStore } from '@/hooks/useStore';
import { TextBox } from '../core';
import { Logo } from '../Logo';
import { UserMenu } from './UserMenu';


// tslint:disable-next-line: variable-name
export const TopBar: FC<Props> = observer(({ onClickMenu }) => {

    const store = useStore();
    const selectedGroupId = useSelectedGroupId(store);

    return <div data-qa-id="topbar-menu" className="fixed z-30 top-0 left-0 w-full dark:bg-gray-900 bg-white border-b border-solid dark:border-gray-700 border-gray-300">
        <div className="hidden lg:flex max-w-screen-xl lg:mx-4 xl:m-auto justify-between py-4 relative">
            <Link to={`/${selectedGroupId}`} className="flex-1 font-thin flex items-center text-gray-500/80 dark:focus-visible:text-white focus-visible:text-gray-600 dark:hover:text-white hover:text-gray-600 outline-none">
                <Logo className="h-5 mr-4" />
                Control Center
            </Link>
            <TextBox innerLabel className="flex-1 w-44 dark:bg-gray-800 bg-gray-100 dark:border-gray-800 border-gray-100" prependIcon="fas fa-search"
                placeholder="Search devices, places and more" defaultValue=""
            />
            <UserMenu className="flex-1 flex justify-end items-center" />
            {/* <div className=" flex justify-end items-center " onClick={onClickMenu}>
                <div>
                    A. Hicks
                    <i className="fas fa-face" />
                </div>
            </div> */}
        </div>
        <div className="flex items-center lg:hidden mx-4 justify-between h-14">
            <button className="flex flex-col justify-center space-y-1" onClick={onClickMenu}>
                <div className="h-1 w-6 bg-gray-500" />
                <div className="h-1 w-6 bg-gray-500" />
                <div className="h-1 w-6 bg-gray-500" />
            </button>
            <Logo className="h-5" />
            <Link to="/settings/notifications" className="text-gray-500 text-lg">
                <i className="far fa-bell" />
            </Link>
        </div>
    </div>;
});

interface Props {
    onClickMenu: () => void
}
