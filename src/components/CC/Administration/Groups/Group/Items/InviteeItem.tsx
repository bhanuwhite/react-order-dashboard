import { FC } from 'react';
import { Invitee } from '@/store/domain/groups/invitees';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { useKeycloakAdminGetUserFetcher } from '@/hooks/fetchers';
import { Button } from '@/components/core';


// tslint:disable-next-line: variable-name
export const InviteeItem: FC<Props> = observer(({ invitee, onCancelInvitee }) => {

    const store = useStore();
    const userId = invitee.type === 'user_id' ? invitee.user_id : undefined;
    const { loading } = useKeycloakAdminGetUserFetcher(userId);

    if (invitee.type === 'email') {
        return <li className="pb-10 pt-10 border-b border-solid last:border-none border-lighter-grey">
            <div className="flex font-size-16 items-center justify-between">
                <div>
                    <div>
                        <span className="font-bold">{invitee.user_email}</span>
                        <span className="bkg-grey-245 bkg-group-hover-lighter-grey inline-block font-size-10 pl-5 pr-5 ml-20 w-100 text-center text-healthy-2 font-bold align-bottom">
                            Invite Sent
                        </span>
                    </div>
                    <div className="lg:mt-5 font-thin font-size-12 font-size-14-desktop-only text-d-grey italic">
                        To join this group, this user needs to create an account with this email address first.
                    </div>
                </div>
                <div>
                    <Button inversed className="mt-0 mb-0" primary small onClick={() => onCancelInvitee(invitee)}>
                        Cancel Invite
                    </Button>
                </div>
            </div>
        </li>;
    }

    const user = store.domain.users.map.get(userId ?? '');
    const name = user?.name ?? 'User not found';
    const hasError = !user;

    if (!user && loading) {
        return <li className="pb-10 pt-10 border-b border-solid last:border-none border-lighter-grey">
            <div className="flex font-size-16 items-center">
                <div className="font-bold">Loading...</div>
                <div className="lg:mt-5" style={{ height: '38px' }}></div>
            </div>
        </li>;
    }

    return <li className="pb-10 pt-10 border-b border-solid last:border-none border-lighter-grey">
        <div className="flex font-size-16 items-center justify-between">
            <div>
                <div>
                    <span className="font-bold">{name}</span>
                    <span className="bkg-grey-245 bkg-group-hover-lighter-grey inline-block font-size-10 pl-5 pr-5 ml-20 w-100 text-center text-healthy-2 font-bold align-bottom">
                        Invite Sent
                    </span>
                </div>
                <div className="lg:mt-5 font-thin font-size-12 font-size-14-desktop-only text-d-grey">
                    {hasError && <span className="italic text-primary">
                        This user probably doesn't belong to the current realm
                    </span>}
                    {user?.props.email}
                </div>
            </div>
            <div>
                <Button inversed className="mt-0 mb-0" primary small onClick={() => onCancelInvitee(invitee)}>
                    Cancel Invite
                </Button>
            </div>
        </div>
    </li>;
});

interface Props {
    invitee: Invitee
    onCancelInvitee: (invitee: Invitee) => void
}
