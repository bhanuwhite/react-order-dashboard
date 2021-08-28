import { SFC } from 'react';
import styles from './OverviewBox.module.scss';


// tslint:disable-next-line: variable-name
export const OverviewBox: SFC<Props> = ({ img, mini, title, children }) => (
    <div className={styles.overviewBox + (mini ? ` ${styles.mini}` : '')}>
        <div className={styles.overviewBoxInner}>
            {img ? <img src={img} /> : null}
            <div className={styles.overviewTitle}>{title}</div>
            <div className={styles.overviewSubtitle}>{children}</div>
        </div>
    </div>
);
interface Props {
    mini?: boolean
    img?: string
    title: string
}