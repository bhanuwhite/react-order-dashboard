import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { nextGraphemeClusterBreak } from '@/strings/grapheme-clusters';
import { createDiv } from '@/utils/dom';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';


// tslint:disable-next-line: variable-name
export const UserMenu: FC<Props> = observer(({ className }) => {

    const store = useStore();
    const [ open, setOpen ] = React.useState(false);
    const firstName = store.view.activeuser.firstName;
    const lastName = store.view.activeuser.lastName;
    const name = firstName.slice(0, nextGraphemeClusterBreak(firstName)).toLocaleUpperCase();

    const btnClassName = 'relative text-sm py-2 px-4 border rounded-full group text-center border-transparent '
        + 'border border-transparent border-solid outline-none focus-visible:border-primary hover:border-primary transition-colors '
        + (open ? 'border-primary text-white bg-primary' : 'text-gray-600 hover:text-primary');

    return <div className={className}>
        <button className={btnClassName}
            onClick={() => setOpen(!open)}
        >
            <i className={`mr-2 fas ${open ? 'fa-caret-up' : 'fa-caret-down opacity-0 group-hover:opacity-100'}`} />
            <span className="mr-7">{name}. {lastName}</span>
            <div className="absolute top-1 right-1 inline-block w-7 h-7 bg-purple-300 rounded-full"/>
        </button>
        <UserMenuDropdown open={open} onClose={() => setOpen(false)} />
    </div>;
});

interface Props {
    className?: string
}


// tslint:disable-next-line: variable-name
const UserMenuDropdown: FC<{ open: boolean, onClose: () => void }> = ({
    open, onClose,
}) => {

    const [ renderRaw, setRenderRaw ] = React.useState(false);

    React.useEffect(() => {

        if (!open && renderRaw) {
            const timeoutId = setTimeout(() => {
                setRenderRaw(false);
            }, 400);

            return () => clearTimeout(timeoutId);
        } else {
            setRenderRaw(open);
        }

    }, [ open ]);

    return renderRaw ? <UserMenuDropdownRaw willBeRemoved={!open} onClose={onClose} /> : null;
};

// tslint:disable-next-line: variable-name
const UserMenuDropdownRaw: FC<{ willBeRemoved: boolean, onClose: () => void }> = ({
    willBeRemoved, onClose,
}) => {

    const [ el ] = React.useState(createDiv);

    React.useEffect(() => {
        document.body.appendChild(el);
        return () => {
            document.body.removeChild(el);
        };
    }, [ el ]);

    return <>
        {createPortal(
            <div onClick={onClose} className={`fixed z-20 flex items-center justify-center inset-0 transition-colors ${willBeRemoved ? 'bg-transparent' : 'bg-black/50 dark:bg-gray-700/70'}`} />,
            el,
        )}
        <div className={`top-24 shadow-md -right-1 text-sm dark:bg-gray-900 bg-white flex flex-col px-6 py-3 rounded-md absolute w-56 ${willBeRemoved ? 'animate-fadeOut' : 'animate-fadeInDown'}`}>
            <div className="absolute border-solid border-8 border-t-transparent border-l-transparent border-r-transparent dark:border-b-gray-900 border-b-white -top-4 right-12" />
            <UserMenuLink onClick={onClose} to="/settings/account">My Account</UserMenuLink>
            <UserMenuLink onClick={onClose} to="/settings/invites">Invitations</UserMenuLink>
            <UserMenuLink onClick={onClose} to="/settings/feature-preview">Feature Preview</UserMenuLink>
            <UserMenuLink onClick={onClose} to="/debug-options">Debug Options</UserMenuLink>
            <a className="font-bold text-bad pt-2 pb-2" href="/logout">Logout</a>
        </div>
    </>;
};

// tslint:disable-next-line: variable-name
const UserMenuLink: FC<{ to: string, onClick: () => void }> = ({ to, onClick, children }) => (
    <Link to={to} onClick={onClick} className="font-bold border-b dark:text-gray-100 text-black border-solid dark:border-gray-700 border-gray-200 pt-2 pb-2">
        {children}
    </Link>
);