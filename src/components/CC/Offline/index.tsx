import * as React from 'react';
import { FC } from 'react';
import { Container } from '@/components/core';
import * as styles from './index.module.scss';


// tslint:disable-next-line: variable-name
export const Offline: FC<Props> = ({}) => (
    <Container solid className="lg:mt-100">
        <h1><Warn style={{ marginRight: '5px' }} />Service offline<Warn style={{ marginLeft: '5px' }} /></h1>
        <hr />
        <h2>We are currently experiencing some technical issues. Please try again later.</h2>
    </Container>
);

interface Props {}

// tslint:disable-next-line: variable-name
const Warn: FC<{ style: React.CSSProperties }> = ({ style }) => (
    <span className={styles.warnSign} style={style}>
        <span className={styles.bar}/>
        <span className={styles.dot}/>
    </span>
);