import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useInvitationsFetcher } from '@/hooks/fetchers';
import { minutes } from '@/utils/units';
import { useStore } from '@/hooks/useStore';
import { LinkButton, Section } from '../core';


// tslint:disable-next-line: variable-name
export const Invitations: FC<Props> = observer(({}) => {

    const store = useStore();
    const pendingInvitesCount = store.domain.invitations.pendingCount;
    const plural = pendingInvitesCount === 1 ? '' : 's';

    // Fetch invitations
    useInvitationsFetcher({ pollInterval: minutes(5) });

    return pendingInvitesCount > 0 ?
        <Section className="mx-4 md:mx-0 mb-6" title="Invitations" infoLink={{ kind: 'tooltip', text: 'TODO' }}>
            <div className="flex items-center">
                <i className="icon-36_Send mr-4 text-xl text-green-300" />
                <div className="flex-grow">You have {pendingInvitesCount} new invitation{plural}</div>
                <LinkButton to="/settings/invites">
                    View Invites
                </LinkButton>
            </div>
        </Section> :
        null;
});

interface Props {}
