import { FC } from 'react';
import * as styles from './index.module.scss';


// tslint:disable-next-line: variable-name
export const Container: FC<Props> = ({ children, className }) => (
    <div className={`${styles.container} ${className ?? ''}`}>{children}</div>
);

interface Props {
    className?: string
}
