import { FC } from 'react';
import { HomeCard } from './HomeCard';
import styles from './home.module.scss';

// tslint:disable-next-line: variable-name
export const Home: FC<Props> = ({}) => (
    <div className={styles.home}>
        <HomeCard title="Demo"
            description="A showcase of all the basic components."
            to="/demo"
        />
        <HomeCard title="Control Center"
            description="Rewrite of Control Center using React & MobX."
            to="/cc"
        />
        <HomeCard title="vTPN"
            description="Product order page for vTPN"
            rawLink
            to="/vtpn.html"
        />
    </div>
);
interface Props {}