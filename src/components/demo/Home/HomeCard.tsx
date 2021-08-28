import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomeCard.module.scss';


// tslint:disable-next-line: variable-name
export const HomeCard: FC<Props> = ({ title, description, to, rawLink }) => (
<div className={`container white-background ${styles.homeCard}`}>
    <div className={styles.homeCardHeader}>
        <h1 className={styles.homeTitle}>{title}</h1>
        <p className={styles.homeDescription}>{description}</p>
    </div>
    <div className={styles.homeCardActions}>
        {rawLink ?
            <a href={to} className={`btn btn-primary ${styles.homeBtn}`}>Continue</a> :
            <Link className={`btn btn-primary ${styles.homeBtn}`} to={to}>Continue</Link>
        }
    </div>
</div>
);
interface Props {
    title: string
    description: string
    to: string
    rawLink?: boolean
}