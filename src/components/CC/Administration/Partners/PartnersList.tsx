import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { Link } from 'react-router-dom';
import { Button, Nothing, Separator, Spinner } from '@/components/core';
import { AddPartnerModal } from './Modals/AddPartnerModal';
import { useAllPartnersFetcher } from '@/hooks/fetchers/acs-endpoints';
import { Container, HeadTitle, PageIntro } from '@/components/core';
import { ErrorBox } from '@/components/core/Errors';
import { PartnerState } from '@/store/domain/partners';
import { unix } from 'moment';


// tslint:disable-next-line: variable-name
export const PartnersList: FC<Props> = observer(() => {

    const store = useStore();
    const [ open, setOpen ] = React.useState(false);
    const { loading, error, fetchNow } = useAllPartnersFetcher();
    const partners = store.domain.partners.all;
    const hasAnyValidPartner = store.domain.partners.hasAnyValidPartner;

    return <>
        <HeadTitle>Veea Control Center - Partners</HeadTitle>
        <PageIntro title="Partners" icon="icon-66_Book">
            View and manage partners.
        </PageIntro>
        <Container solid className="p-10 lg:p-30">
            <AddPartnerModal open={open} onClose={() => setOpen(false)} refreshPartnerList={fetchNow} />
            <div className="flex justify-end">
                <Button success onClick={() => setOpen(true)}>
                    <i className="fas fa-plus mr-5"/>Create new Partner
                </Button>
            </div>
            <Separator className="mt-0">Partners</Separator>
            {!hasAnyValidPartner && loading ? <Spinner /> : null}
            {error ? <ErrorBox className="mt-10 mb-10">{error.message}</ErrorBox> : null}
            <ul className="mt-5">
                {partners.map(p => <PartnerItem key={p.id} partner={p} />)}
                {partners.length === 0 && !loading ? <Nothing>No partners found</Nothing> : null}
            </ul>
        </Container>
    </>;
});


interface Props {}


// tslint:disable-next-line: variable-name
const PartnerItem: FC<{ partner: PartnerState }> = ({ partner }) => {

    let name = 'Loading...';
    let description = '...';

    if (!partner.props.isPartial) {
        name = partner.props.name;
        description = `Last updated ${unix(partner.props.updatedAt / 1000).fromNow()}` + (partner.props.updatedBy ? ` by ${partner.props.updatedBy}` : '');
    }

    return <li className="cursor-pointer p-15 group bkg-hover-grey-245 border-b border-solid last:border-none border-lighter-grey">
        <Link to={`/cc/admin/partners/${partner.id}`} className="no-underline">
            <div className="font-size-16 text-primary">
                {name}
            </div>
            <div className="lg:mt-5 font-thin font-size-12 font-size-14-desktop-only text-d-grey">
                {description}
            </div>
        </Link>
    </li>;
};