import styles from './padding-top.module.scss';
import { FC } from 'react';
import { useBodyClass } from '@/hooks/useBodyClass';


// tslint:disable-next-line: variable-name
export const PaddingTop: FC<{}> = () => {
    useBodyClass(styles.paddingTop);
    return null;
};