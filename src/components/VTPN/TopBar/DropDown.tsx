import { FC } from 'react';
import * as styles from './DropDown.module.scss';


// tslint:disable-next-line: variable-name
export const DropDown: FC<Props> = ({ links, to, children }) => (
    <div className="group relative flex items-center border border-solid border-t-2 border-transparent hover:border-light-grey hover:border-t-primary bkg-hover-grey-249" style={{ height: '100%' }}>
        <a href={`https://www.veea.com/${to}`} className={`pl-20 pr-20 font-size-14 no-underline group-hover:text-black text-grey-63 ${styles.mainLink}`}>
            {children}
        </a>
        <div className="absolute bottom-0 hidden lg:block" style={{ left: '-1px' }}>
            <div className="w-200 hidden group-hover:block absolute bkg-grey-249 border border-solid border-light-grey font-size-14 -top-2 p-5">
                {links.map(([link, name]) =>
                    <a key={link} className="bkg-hover-lighter-grey text-grey-63 hover:text-black no-underline block p-15 pt-12 pb-12" href={`https://www.veea.com/${link}`}>
                        {name}
                    </a>,
                )}
            </div>
        </div>
    </div>
);

interface Props {
    to: string
    links: [link: string, name: string][]
}
