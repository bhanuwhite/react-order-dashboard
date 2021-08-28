import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { PageIntro, Container, Separator, Spinner, ActionModal, Modal, Button, Nothing } from '@/components/core';
import { PaymentCard } from './PaymentCard';
import { HeadTitle } from '@/components/core';
import { usePaymentDetailsFetcher, useAllSubscriptionsFetcher } from '@/hooks/fetchers';
import { ErrorBox } from '@/components/core/Errors';
import { CardState } from '@/store/domain/account';
import { removeCard, assignDefaultCard } from '@/actions';
import { AddPaymentCardModal } from '@/components/CC/AddPaymentCardModal';
import { Store } from '@/store';
import { mergeFetchers } from '@/fetcher';


// tslint:disable-next-line: variable-name
export const Account: FC<{}> = observer(({}) => {

    const [cardToRemove, setCardToRemove] = React.useState<CardState | null>(null);
    const [cardToAssignDefault, setCardToAssignDefault] = React.useState<CardState | null>(null);
    const [cannotDeleteCard, setCannotDeleteCard] = React.useState<CardState | null>(null);
    const [addCardModalOpen, setAddCardModalOpen] = React.useState(false);
    const store = useStore();
    const { loading, error } = mergeFetchers(
        usePaymentDetailsFetcher(),
        useAllSubscriptionsFetcher(),
    );

    const paymentSources = store.domain.account.sources.all;
    const { firstName, lastName, email } = store.view.activeuser;
    const userHasPaidSubscriptions = store.domain.account.stripeSubscriptions.active.length > 0;

    function onClickAddCard(ev: React.MouseEvent<HTMLAnchorElement>) {
        ev.preventDefault();
        setAddCardModalOpen(true);
    }

    // if there is the only one payment method and there are live subscriptions, prevent the user from deleting
    const removeCardClickHandler = paymentSources.length === 1 && userHasPaidSubscriptions
        ? setCannotDeleteCard
        : setCardToRemove;

    let paymentInfo: React.ReactElement[] | React.ReactElement = paymentSources.map(src => {
        switch (src.type) {
            case 'card':
                return <PaymentCard
                    key={src.id}
                    card={src}
                    onClickRemoveCard={removeCardClickHandler}
                    onClickAssignDefaultCard={setCardToAssignDefault}
                />;
            default:
                return <ErrorBox key={src.id}>
                    {`Support for ${src.type} not yet implemented`}
                </ErrorBox>;
        }
    });

    if (paymentSources.length === 0) {
        if (loading) {
            paymentInfo = <Spinner />;
        }
        if (error) {
            paymentInfo = <ErrorBox>{error.message}</ErrorBox>;
        }
    }

    return <>
    <HeadTitle>Veea Control Center - Account</HeadTitle>
    <PageIntro title="Account" icon="icon-11_My_Profile">
        View and manage your Veea account.
    </PageIntro>
    <Container solid className="pt-10 p-20">
        <div style={{ padding: '17px 5px', textAlign: 'left' }}>
            <h1 style={{ fontSize: '19px', lineHeight: '1.3em' }}>Hello, {firstName} {lastName}!</h1>
            <h2 style={{ fontSize: '17px', lineHeight: '1.3em', marginBottom: 0 }}>{email}</h2>
        </div>
        <Separator className="mt-10 mb-10">Account Management</Separator>
        <a href={`/account/change-password?redirectPath=${encodeURIComponent('/#/cc/account/')}`} className="mb-10 flat-btn big">
            <i className="icon-13_Password" />
            <b>Change Password</b><p>Change your Veea account password.</p>
        </a>
        <Separator className="mt-10 mb-10">Payment Information</Separator>

        {paymentSources.length > 0 ? <>

            <AddPaymentCardModal open={addCardModalOpen} onClose={() => setAddCardModalOpen(false)} confirmText="Add Card" />
            <RemoveCardModal card={cardToRemove} store={store} onClose={setCardToRemove} />
            <AssignDefaultCardModal card={cardToAssignDefault} store={store} onClose={setCardToAssignDefault} />

            <Modal title="Unable to Delete" centered noClose open={cannotDeleteCard !== null} >
                You must have a payment method on file while you have active subscriptions on your VeeaHubs.
                <hr />
                <Button large primary onClick={() => setCannotDeleteCard(null)}>OK</Button>
            </Modal>

            {paymentInfo}
            <a onClick={onClickAddCard} className="mb-0 flat-btn" style={{ cursor: 'pointer' }}>
                <i className="fas fa-plus-circle" style={{ color: '#268733' }} />
                <b>Add new card</b>
            </a>

        </> : loading ? <Spinner /> : <Nothing raw>
            <b>No payment information found.</b><br />
            Once you subscribe to a VeeaHub package, your payment information can be viewed and modified here.
        </Nothing>}

    </Container>
    </>;
});

// tslint:disable-next-line: variable-name
const RemoveCardModal: FC<CardModalProps> = ({ card, store, onClose }) => (
    <ActionModal open={card !== null} noClose actions={[
            {
                text: 'Remove Card',
                type: 'primary' as const,
                run:  async () => {
                    const res = await removeCard(store, card?.id ?? '');
                    if (res.success) {
                        return { success: true,
                                description: 'Your card has been successfully removed' };
                    } else {
                        return { success: false,
                                summary: 'Unable to remove card',
                                description: `There was an error ${res.message}` };
                    }
                },
            },
        ]}
        style={{ maxWidth: '550px' }}
        onClose={() => onClose(null)}
    >
        Are you sure you want to remove your <b>{card?.brand}</b> card{' '}
        ending with <b>{card?.last4}</b>?
    </ActionModal>
);

// tslint:disable-next-line: variable-name
const AssignDefaultCardModal: FC<CardModalProps> = ({ card, store, onClose }) => (
    <ActionModal open={card !== null} noClose actions={[
            {
                text: 'Set as Default',
                type: 'success' as const,
                run:  async () => {
                    const res = await assignDefaultCard(store, card?.id ?? '');
                    if (res.success) {
                        return { success: true,
                                description: 'Your card has been set as the default payment method' };
                    } else {
                        return { success: false,
                                summary: 'Unable to assign card as the default payment method',
                                description: `There was an error ${res.message}` };
                    }
                },
            },
        ]}
        style={{ maxWidth: '550px' }}
        onClose={() => onClose(null)}
    >
        Are you sure you want to set <b>{card?.brand}</b> card{' '}
        ending with <b>{card?.last4}</b> as the default payment method?
    </ActionModal>
);

interface CardModalProps {
    card: CardState | null
    store: Store
    onClose: React.Dispatch<React.SetStateAction<CardState | null>>
}