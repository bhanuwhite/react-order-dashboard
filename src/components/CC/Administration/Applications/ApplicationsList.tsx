import * as React from 'react';
import { FC } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, LinkButton, Nothing, Spinner, Separator } from '@/components/core';
import { useACLAllFetcher, usePartnerApplicationsFetcher } from '@/hooks/fetchers/acs-endpoints';
import { useStore } from '@/hooks/useStore';
import { ErrorBox } from '@/components/core/Errors';
import { mergeFetchers } from '@/fetcher';
import { PartnerApplication } from '@/store/domain/partners/applications';
import styles from './ApplicationList.module.scss';
import { AddACLModal } from '../ACLs/Modals/AddACLModal';
import { ShowMorePanel } from '@/components/core/ShowMorePanel';


// tslint:disable-next-line: variable-name
export const ApplicationsList: FC<{}> = observer(() => {
    const store = useStore();
    const [ aclModalOpen, setACLModalOpen ] = React.useState(false);
    const partnerId = store.view.activeuser.partnerId ?? '';
    const partner = store.domain.partners.map.get(partnerId);

    const { loading, error, fetchNow } = mergeFetchers(
        usePartnerApplicationsFetcher(partnerId),
        useACLAllFetcher(partnerId),
    );

    const applicationsByVersion = partner?.applications.applicationsByVersion;
    const hasAnyApplication = partner?.hasAnyApplications;
    const userCanCreateApplication = partner?.hasAnyACLs;

    if (loading && !partner || loading && !hasAnyApplication) {
        return <Spinner />;
    }

    return <>
        <AddACLModal open={aclModalOpen} onClose={() => setACLModalOpen(false)}
                refreshAclList={fetchNow} />
        <div className="flex justify-end">
            <LinkButton success disabled={!userCanCreateApplication} className="pl-15 pr-15"
                to={'/cc/applications' + (userCanCreateApplication ? '/new' : '')}>
                <i className="fas fa-plus mr-5"/> Create new Application
            </LinkButton>
        </div>
        {error ? <ErrorBox className="mt-10 mb-10">{error.message}</ErrorBox> : null}
        <ul className="mt-10">
            {applicationsByVersion && Object.keys(applicationsByVersion).map((appCommercialId, i) => (
                <ApplicationItem key={i}
                    appTitle={applicationsByVersion[appCommercialId][0].title}
                    versions={applicationsByVersion[appCommercialId]}
                />
            ))}
            {!hasAnyApplication && !loading &&
                <Nothing raw className={!userCanCreateApplication ? 'pb-20 pt-25' : ''}>
                    <b>No applications found</b><br/>
                    {!userCanCreateApplication && <div className="mt-5">
                        In order to create an Application you first have to create a Testing Team
                    </div>}
                    {!userCanCreateApplication && <div className="mt-10">
                        <Button success onClick={() => setACLModalOpen(true)}>
                            <i className="fas fa-plus mr-5"/> Create new Testing Team
                        </Button>
                    </div>}
                </Nothing>}
        </ul>
        {!hasAnyApplication && <div className="text-d-grey flex justify-center pt-10 font-size-14">
            You can find more information about the Applications and Testing Teams
            <a className="ml-5" href="https://veea.zendesk.com/hc/en-us">here</a>
        </div>}
    </>;
});

// tslint:disable-next-line: variable-name
const ApplicationItem: FC<ApplicationItemProps> = ({ versions, appTitle }) => (
    <li className="pb-10">
        <div className="flex">
            <Separator className="flex-grow mt-0 mr-10">{appTitle}</Separator>
            <Link className={`pl-10 ${styles.newVersionButton}`} to={`/cc/applications/${versions[0].id}/version`}>
                <span><i className="fas fa-plus mr-5 font-size-12"/>Add new version</span>
            </Link>
        </div>
        {versions.length > 3 ?
            <ShowMorePanel defaultValue={false} startingHeight={226} qtyRemainingItems={versions.length - 3}>
                <ApplicationVersions versions={versions} />
            </ShowMorePanel> : <ApplicationVersions versions={versions} />}
    </li>
);

// tslint:disable-next-line: variable-name
const ApplicationVersions: FC<{ versions: PartnerApplication[] }> = ({ versions }) => (
    <ul className="mt-5">
        {versions.map(application => <li key={application.id} className="cursor-pointer border-b border-solid last:border-none border-lighter-grey p-15 group bkg-hover-grey-245">
            <Link to={`/cc/applications/${application.id}`} className="no-underline">
                <div className="flex justify-between">
                    <div>
                        <div>
                            <span className="font-size-16 text-primary">
                                Version {application.version}
                            </span>
                            {application.public ?
                                <span title="This version of the application is public" className="bkg-grey-245 bkg-group-hover-lighter-grey inline-block font-size-10 pl-5 pr-5 ml-20 w-100 text-center text-healthy-2 font-bold align-bottom">
                                    PUBLIC
                                </span> :
                                <span title="Testing Team" className="bkg-grey-245 bkg-group-hover-lighter-grey inline-block font-size-10 pl-5 pr-5 ml-20 w-100 text-center truncate align-bottom text-black">
                                    {application.aclName ?? 'Unknown Testing Team'}
                                </span>
                            }
                        </div>
                        <div className="lg:mt-5 font-thin font-size-12 font-size-14-desktop-only text-d-grey">
                            {(application.lastUpdatedBy || application.lastUpdatedAt) && `Last updated`
                                + (application.lastUpdatedAt ? ` ${moment(application.lastUpdatedAt).fromNow()}` : '')
                                + (application.lastUpdatedBy ? ` by ${application.lastUpdatedBy}` : '')
                            }
                        </div>
                    </div>
                    <div className="flex items-center">
                        {!application.hasAppContainers &&
                            <span className="text-primary font-size-12" title="You can add the application binary by clicking on this application">
                                Binary missing
                            </span>
                        }
                    </div>
                </div>
            </Link>
        </li>)}
    </ul>
);

interface ApplicationItemProps {
    appTitle: string
    versions: PartnerApplication[]
}