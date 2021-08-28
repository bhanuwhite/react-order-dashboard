import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { InvitationState } from '@/store/domain/invitations';
import { useStore } from '@/hooks/useStore';
import { PageIntro, Container, Button, Nothing } from '@/components/core';
import { ErrorBox } from '@/components/core/Errors';
import { useKeycloakAdminGetUserFetcher, useInvitationsFetcher } from '@/hooks/fetchers';
import { acceptAllInvitations, acceptInvitation, declineInvitation } from '@/actions';


// tslint:disable-next-line: variable-name
export const Invitations: FC<{}> = observer(({}) => {

    const store = useStore();
    const { fetchNow } = useInvitationsFetcher();
    const invitations = store.domain.invitations.all;
    const pendingCount = store.domain.invitations.pendingCount;

    const [ error, setError ] = React.useState('');

    function clearError() {
        setError('');
    }

    async function acceptAll() {
        const res = await acceptAllInvitations(store);
        if (!res.success) {
            setError(res.message);
        }
    }

    const allInvitesAreBeingProcessed = invitations.filter(inv => inv.status === 'received').all(
        inv => store.view.requests.inviteProcessed.has(inv.id),
    );
    const acceptAllDisabled = pendingCount === 0 || allInvitesAreBeingProcessed;

    return <>
        <PageIntro title="Invites" icon="icon-36_Send">
            View and accept invitations
        </PageIntro>
        <Container solid className="p-10 lg:p-30">
            {error.length > 0 && /** FIXME: We want something cleaner. */
                <div onClick={clearError}>
                    <ErrorBox>{error}</ErrorBox>
                </div>
            }
            {invitations.length === 0 ?
                <NoInvitationsFound /> :
                <>
                    <div className="flex justify-between mb-10" style={{ padding: '2px' }}>
                        <h1 className="font-size-18">
                            You have {pendingCount} pending invitation{pendingCount === 1 ? '' : 's'}.
                        </h1>
                        <button disabled={acceptAllDisabled} onClick={acceptAll}
                            className={`border-none bkg-none p-0 no-underline text-info font-bold ${acceptAllDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline cursor-pointer'}`}
                        >
                            Accept all
                        </button>
                    </div>
                    {invitations.map(inv =>
                        <Invitation key={inv.id} inv={inv} setError={setError} refresh={fetchNow} />,
                    )}
                </>
            }
        </Container>
    </>;
});


// tslint:disable-next-line: variable-name
const NoInvitationsFound: FC<{}> = () => (
    <Nothing raw>
        <div className="pb-20"><i className="icon-36_Send" style={{ fontSize: '50px' }}/><br/></div>
        <div className="font-bold">You have no invitations.</div>
        When someone invites you to a group, the invitations will show up here.
    </Nothing>
);

// tslint:disable-next-line: variable-name
const Invitation: FC<InvitationProps> = observer(({ inv, setError, refresh }) => {

    const store = useStore();
    const areButtonsDisabled = store.view.requests.inviteProcessed.has(inv.id);

    useKeycloakAdminGetUserFetcher(inv.created_by);
    const user = store.domain.users.mapByVeeaId.get(inv.created_by);

    const bkg = inv.status === 'accepted' ? 'bkg-green-248-230 fadeout delay-4s duration-500ms forwards' :
        inv.status === 'rejected' ? 'bkg-red-248-230 fadeout delay-4s duration-500ms forwards' :
        'bkg-grey-242';

    async function reject() {
        const res = await declineInvitation(store, inv.id);
        if (!res.success) {
            setError(res.message);
        } else {
            refresh();
        }
    }

    async function accept() {
        const res = await acceptInvitation(store, inv.id);
        if (!res.success) {
            setError(res.message);
        } else {
            refresh();
        }
    }

    return <div className={`p-25 ${bkg} flex justify-between items-center`}>
        <div>
            {user ?
                <>
                    <span className="font-bold">{user.name} </span>
                    ({user.props.email})
                </> :
                `User ${inv.created_by}`
            }
            {' '} invited you to join group <span className="font-bold">"{inv.group_name}"</span>
        </div>
        {
            inv.status === 'accepted' ?
            <div className="font-bold text-success">
                Accepted
            </div> :
            inv.status === 'rejected' ?
            <div className="font-bold text-primary">
                Rejected
            </div> :
            <div className="flex-shrink-0">
                <button disabled={areButtonsDisabled} onClick={reject}
                    className={`border-none bkg-none p-0 no-underline text-offline pl-30 pr-30 font-bold ${areButtonsDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline cursor-pointer'}`}
                >
                    Reject
                </button>
                <Button disabled={areButtonsDisabled} onClick={accept} info small className="pl-30 pr-30 m-0 ml-10">
                    Accept
                </Button>
            </div>
        }
    </div>;
});

interface InvitationProps {
    inv: InvitationState
    setError: (err: string) => void
    refresh: () => void
}
