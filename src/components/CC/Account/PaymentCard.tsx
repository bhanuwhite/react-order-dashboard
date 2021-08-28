import * as React from 'react';
import { SFC } from 'react';
import { CardState } from '@/store/domain/account';
import styles from './PaymentCard.module.scss';


// tslint:disable-next-line: variable-name
export const PaymentCard: SFC<Props> = ({ card, onClickRemoveCard, onClickAssignDefaultCard }) => {

    function onClick(ev: React.MouseEvent<HTMLAnchorElement>) {
        ev.preventDefault();
        if (ev.currentTarget.className === 'remove-card') {
            onClickRemoveCard(card);
        } else {
            onClickAssignDefaultCard(card);
        }
    }

    const expMonth = card.exp_month < 10 ? `0${card.exp_month}` : card.exp_month;

    return <div className={styles.paymentCard}>
        <i className="icon-37_Card"/>
        <div className="font-size-16 font-bold inline-block capitalize">
            {card.brand}
        </div>
        <div className={styles.last4}>···· {card.last4}</div>
        <div className={styles.expiration}>
            {card.default ? <p className={styles.defaultCard}>Default card</p> : null}
            Expiration: {expMonth} / {card.exp_year}
        </div>
        <div className={styles.rightButtons}>
            {!card.default && <a onClick={onClick} className={styles.setDefaultCard}>Set as Default</a>}
            <a onClick={onClick} className="remove-card">Remove Card</a>
        </div>
    </div>;
};
interface Props {
    card: CardState
    onClickRemoveCard(card: CardState): void
    onClickAssignDefaultCard(card: CardState): void
}