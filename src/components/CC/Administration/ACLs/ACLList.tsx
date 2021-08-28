import React, { FC } from 'react';
import { Button, Nothing, Separator, Spinner } from '@/components/core';
import { AddACLModal } from './Modals/AddACLModal';
import { useACLAllFetcher } from '@/hooks/fetchers/acs-endpoints';
import { useStore } from '@/hooks/useStore';
import { ACLInfo } from '@/store/domain/partners';
import { ErrorBox } from '@/components/core/Errors';
import { Link } from 'react-router-dom';
import { unix } from 'moment';
import { observer } from 'mobx-react-lite';

// tslint:disable-next-line: variable-name
export const ACLList: FC<{}> = observer(() => {
    const [openModal, setOpenModal] = React.useState(false);

    const store = useStore();
    const partnerId = store.view.activeuser.partnerId ?? '';
    const { loading, error, fetchNow } = useACLAllFetcher(partnerId);
    const acls = store.domain.partners.map.get(partnerId)?.acls ?? [];

    return <>
        <AddACLModal open={openModal} onClose={() => setOpenModal(false)} refreshAclList={fetchNow} />
        <div className="flex justify-end">
            <Button success onClick={() => setOpenModal(true)}>
                <i className="fas fa-plus mr-5"/>Create new Testing Team
            </Button>
        </div>
        <Separator className="mt-0">Testing Teams</Separator>
        {loading && acls.length === 0 && <Spinner />}
        {error && <ErrorBox className="mt-10 mb-10">{error.message}</ErrorBox>}
        <ul className="mt-5">
            {acls.map((acl: ACLInfo) => <AclItem acl={acl} key={acl.id} />)}
            {acls.length === 0 && !loading && <Nothing raw>There are no Testing Teams</Nothing>}
        </ul>
    </>;
});

// tslint:disable-next-line: variable-name
const AclItem: FC<ItemProps> = ({ acl }) => {
    const description = `Last updated ${unix(acl.updatedAt / 1000).fromNow()}${acl.updatedBy ? ` by ${acl.updatedBy}` : ''}`;
    return <li className="cursor-pointer p-15 group bkg-hover-grey-245 border-b border-solid last:border-none border-lighter-grey">
        <Link to={`/cc/applications/testing-teams/${acl.id}`} className="no-underline">
            <div className="font-size-16 text-primary">
                {acl.name}
            </div>
            <div className="lg:mt-5 font-thin font-size-12 font-size-14-desktop-only text-d-grey">
                {description}
            </div>
        </Link>
    </li>;
};

interface ItemProps {
    acl: ACLInfo
}
