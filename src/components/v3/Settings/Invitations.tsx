import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { InvitationState } from '@/store/domain/invitations';
import { useStore } from '@/hooks/useStore';
import { useKeycloakAdminGetUserFetcher, useInvitationsFetcher } from '@/hooks/fetchers';
import { acceptAllInvitations, acceptInvitation, declineInvitation } from '@/actions';
import { GrayContainer, InfoBox, Button } from '../core';


// tslint:disable-next-line: variable-name
export const Invitations: FC<Props> = observer(({}) => {

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
        {error.length > 0 &&
            <InfoBox kind="error" className="mb-4" onClose={clearError}>{error}</InfoBox>
        }
        {invitations.length === 0 ?
            <NoInvitationsFound /> :
            <>
                <div className="flex justify-end mb-4">
                    <button disabled={acceptAllDisabled} onClick={acceptAll}
                        className={`pr-10 text-primary ${acceptAllDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline cursor-pointer'}`}
                    >
                        Accept all
                    </button>
                </div>
                {invitations.map(inv =>
                    <Invitation key={inv.id} inv={inv} setError={setError} refresh={fetchNow} />,
                )}
            </>
        }
    </>;
});

interface Props {}

// tslint:disable-next-line: variable-name
const NoInvitationsFound: FC<{}> = ({}) => (
    <GrayContainer className="p-6 text-center">
        <div className="pb-3"><i className="icon-36_Send" style={{ fontSize: '50px' }}/><br/></div>
        <div className="font-medium">You have no invitations.</div>
        When someone invites you to a group, the invitations will show up here.
    </GrayContainer>
);

// tslint:disable-next-line: variable-name
const Invitation: FC<InvitationProps> = observer(({ inv, setError, refresh }) => {

    const store = useStore();
    const areButtonsDisabled = store.view.requests.inviteProcessed.has(inv.id);

    useKeycloakAdminGetUserFetcher(inv.created_by);
    const user = store.domain.users.mapByVeeaId.get(inv.created_by);

    const bkg = inv.status === 'accepted' ? 'bg-good/20 animate-fadeOut delay-4s duration-500ms' :
        inv.status === 'rejected' ? 'dark:bg-red-900/60 bg-red-200 animate-fadeOut delay-4s duration-500ms' :
        'dark:bg-gray-700 bg-gray-100';

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

    const fullDetails = user ? `${user.name} (${user.props.email})` : `User ${inv.created_by}`;
    const userColor = inv.status === 'accepted' ? 'text-green-700' :
        inv.status === 'rejected' ? 'dark:text-red-700 text-red-800' :
        'text-gray-500';

    return <div className={`rounded p-6 ${bkg} mt-4 flex flex-wrap sm:flex-nowrap justify-between items-center`}>
        <div className="mb-2 sm:mb-0">
            <div className={`mb-2 text-sm ${userColor}`}>
                {fullDetails}
            </div>
            <div className={inv.status === 'rejected' ? 'line-through' : ''}>
                {user ?
                    user.name :
                    `User ${inv.created_by}`
                }
                {' '}invited you to join the group <span className="font-bold">"{inv.group_name}"</span>
            </div>
        </div>
        {
            inv.status === 'accepted' ?
            <div className="text-green-700 px-8">
                Accepted
            </div> :
            inv.status === 'rejected' ?
            <div className="dark:text-red-700 text-red-800 px-8">
                Rejected
            </div> :
            <div className="flex-shrink-0 mx-auto sm:mx-0">
                <button disabled={areButtonsDisabled} onClick={reject}
                    className={`text-bad py-2 px-8 ${areButtonsDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline cursor-pointer'}`}
                >
                    Reject
                </button>
                <Button disabled={areButtonsDisabled} onClick={accept} className="px-8">
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