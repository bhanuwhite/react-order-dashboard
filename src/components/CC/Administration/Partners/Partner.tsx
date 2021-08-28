import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import { Button, Nothing, Separator, Spinner } from '@/components/core';
import { useStore } from '@/hooks/useStore';
import { usePartnerFetcher } from '@/hooks/fetchers/acs-endpoints';
import { Container, HeadTitle, PageIntro } from '@/components/core';
import { ErrorBox } from '@/components/core/Errors';
import { AddUserToPartner } from '@/components/CC/Administration/AddUserTo/AddUserToPartner';
import { NotFoundBody } from '@/components/CC/404';
import { EditPartnerInfoModal } from './Modals/EditPartnerInfoModal';
import { PartnerState } from '@/store/domain/partners';
import { RemoveUserFromPartner } from './Modals/RemoveUserFromPartner';
import { UserState } from '@/store/domain/users';
import { UserItem } from '../UserItem';


// tslint:disable-next-line: variable-name
export const Partner: FC<Props> = observer(({}) => {

    const store = useStore();
    const { partnerId } = useParams<{ partnerId?: string }>();
    const { loading, error, fetchNow } = usePartnerFetcher(partnerId);
    const partner = store.domain.partners.map.get(partnerId ?? '');

    if (!partner) {
        if (loading) {
            return <Spinner />;
        }
        if (error) {
            return <ErrorBox>{error.message}</ErrorBox>;
        }
        return <NotFoundBody />;
    }

    return <PartnerBody partner={partner} loading={loading} fetchNow={fetchNow} />;
});

interface Props {}


// tslint:disable-next-line: variable-name
export const PartnerPage: FC<{}> = observer(({}) => {

    const store = useStore();
    const { partnerId } = useParams<{ partnerId?: string }>();
    const { loading, fetchNow } = usePartnerFetcher(partnerId);
    const partner = store.domain.partners.map.get(partnerId ?? '');
    const name = partner && !partner.props.isPartial ? partner.props.name : `Partner ${partnerId}`;

    return <>
        <HeadTitle>Veea Control Center - {name}</HeadTitle>
        <PageIntro title={name} icon="icon-166_Hierarchy">
            <Link to="/cc/admin/partners"><i className="fas fa-chevron-left"></i>All Partners</Link>
        </PageIntro>
        <Container solid className="p-10 lg:p-30">
            {!partner && loading && <Spinner />}
            {partner && <PartnerBody partner={partner} loading={loading} fetchNow={fetchNow} />}
        </Container>
    </>;
});


// tslint:disable-next-line: variable-name
const PartnerBody: FC<PartnerBodyProps> = ({ loading, partner, fetchNow }) => {

    const [ addUserOpen, setAddUserOpen ] = React.useState(false);
    const [ editPartnerOpen, setEditPartnerOpen ] = React.useState(false);
    const [ removeUserOpen, setRemoveUserOpen ] = React.useState(false);
    const [ user, setUser ] = React.useState<null | UserState>(null);
    const name = !partner.props.isPartial ? partner.props.name : 'Loading...';
    const description = !partner.props.isPartial ? partner.props.description : '...';

    function onRemoveUser(userToRemove: UserState) {
        setUser(userToRemove);
        setRemoveUserOpen(true);
    }

    return <>
        {!partner.props.isPartial &&
            <EditPartnerInfoModal name={partner.props.name} description={partner.props.description} id={partner.id}
                open={editPartnerOpen} onClose={() => setEditPartnerOpen(false)} />
        }
        <AddUserToPartner partner={partner} open={addUserOpen} onClose={() => setAddUserOpen(false)}
            refreshUserList={fetchNow} />
        {!partner.props.isPartial &&
            <RemoveUserFromPartner partner={partner} user={user} open={removeUserOpen}
                onClose={() => setRemoveUserOpen(false)}
                refreshPartner={fetchNow} />
        }
        <div className="flex justify-between items-start">
            <div>
                <h3 className="mb-10"><b>Name</b></h3>
                <p>{name}</p>
            </div>
            <div>
                <h3 className="mb-10"><b>Partner ID</b></h3>
                <p>{partner.id}</p>
            </div>
            <Button inversed info onClick={() => setEditPartnerOpen(true)}>
                <i className="fas fa-pen mr-10"/>Edit info
            </Button>
        </div>
        <div className="flex mt-20 pb-10 justify-start">
            <div>
                <h3 className="mb-10"><b>Description</b></h3>
                <p>{description}</p>
            </div>
        </div>
        <div className="flex mt-20 mb-15">
            <Separator className="flex-grow mt-0 mr-10">Users</Separator>
            <Button inversed success className="m-0 pl-10 text-success-color" onClick={() => setAddUserOpen(true)}>
                <span><i className="fas fa-plus mr-5 font-size-12"/>Add users</span>
            </Button>
        </div>
        {
            partner.users.length === 0 && loading ? <Spinner /> :
            partner.users.length === 0 ?
            <Nothing>
                This partner has no developers.
            </Nothing> :
            <ul>
                {partner.users.map(id => <UserItem key={id} userId={id} onRemoveUser={onRemoveUser} />)}
            </ul>
        }
    </>;
};

interface PartnerBodyProps {
    loading: boolean
    partner: PartnerState
    fetchNow: () => Promise<void>
}