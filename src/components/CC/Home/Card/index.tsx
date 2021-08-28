import { FC } from 'react';
import * as style from './index.module.scss';


// tslint:disable-next-line: variable-name
export const Card: FC<Props> = ({ children, title, icon }) => (
    <div className={style.card}>
        <div className={style.cardHeader}>
            <div className={style.cardName}>{title}</div>
            <i className={`${style.cardIcon} ${icon}`} />
        </div>
        <div className={style.cardContent}>{children}</div>
    </div>
);

interface Props {
    title: string
    icon: string
}
