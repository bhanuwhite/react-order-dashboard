import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { PageIntro, Container, ExternalLinkButton, LinkButton } from '@/components/core';
import { useStore } from '@/hooks/useStore';
import { useInvitationsFetcher } from '@/hooks/fetchers';
import { minutes } from '@/utils/units';


// tslint:disable-next-line: variable-name
export const OnboardingNeeded: FC<{}> = observer(({}) => {

    const store = useStore();
    const pendingInvitesCount = store.domain.invitations.pendingCount;

    // Fetch invitations
    useInvitationsFetcher({ pollInterval: minutes(5) });

    return <>
        <PageIntro icon="icon-39_Information" title="No VeeaHubs">
            You don't currently have any VeeaHubs paired to your account.
        </PageIntro>

        <Container solid className="p-20 lg:p-40">
            <h1 className="mb-15">Welcome to Veea Control Center</h1>
            <p className="font-thin mb-5 font-size-18">
                Please follow the instructions provided with your VeeaHub to add it to your account.{' '}
            </p>
            <p className="font-thin mb-20 font-size-18">
                Once you have VeeaHubs added to your account, you can access and manage them using Veea Control Center.
            </p>
            <p className="font-thin font-size-14">
                This account (<span className="font-bold">{store.view.activeuser.email}</span>){' '}
                currently does not have any VeeaHubs associated with it.
            </p>
            <p className="font-thin font-size-14 pb-10">
                If you believe this is an error, please contact your IT department or contact us by going to <a href="https://www.veea.com/support">www.veea.com/support</a>
            </p>
            {pendingInvitesCount > 0 &&
                <div className="flex justify-between items-center mt-15 p-10 pl-20 pr-15 rounded-6 bkg-yellow">
                    <div className="font-thin font-size-14 text-primary">
                        <i className="icon-36_Send font-size-26 mr-20 align-bottom" />
                        You have {pendingInvitesCount} pending invite{pendingInvitesCount > 1 ? 's' : ''}.
                    </div>
                    <LinkButton info to="/cc/invites" className="w-100 lg:w-200">
                        View invites
                    </LinkButton>
                </div>
            }
            <hr />
            <div className="flex">
                <i className="hidden lg:block icon-25_Devices font-size-28 mr-20" />
                <div className="flex-grow">
                    <h2 className="mb-10 text-black">Just added your VeeaHubs?</h2>
                    <p className="font-thin font-size-14">
                        If you have recently added VeeaHubs to your account, click the button on the right to continue.
                    </p>
                </div>
                <div className="ml-5 self-center">
                    <ExternalLinkButton className="w-100 lg:w-200" info href="/onboarding-continue">
                        Continue
                    </ExternalLinkButton>
                </div>
            </div>
            <hr />
            <div className="flex">
                <i className="hidden lg:block icon-123_Package font-size-28 mr-20" />
                <div className="flex-grow">
                    <h2 className="mb-10 text-black">Check the status of your order</h2>
                    <p className="font-thin font-size-14">
                        If you have recently ordered VeeaHubs, please visit the <a target="_blank" href={`${window.VTPN_SIGNUP_URL}#/my-orders`}>
                            My Orders
                        </a> page to track and modify your order.
                    </p>
                </div>
                <div className="ml-5 self-center">
                    <ExternalLinkButton className="w-100 lg:w-200" info href={`${window.VTPN_SIGNUP_URL}#/my-orders`}>
                        My Orders
                    </ExternalLinkButton>
                </div>
            </div>
            <hr />
            <div className="flex">
                <i className="hidden lg:block icon-6_Help font-size-28 mr-20" />
                <div className="flex-grow">
                    <h2 className="mb-10 text-black">Need help?</h2>
                    <p className="font-thin font-size-14">
                        If you are having problems adding VeeaHubs to your account, please visit the Support{' '}
                        Center to contact us.
                    </p>
                </div>
                <div className="ml-5 self-center">
                    <ExternalLinkButton className="w-100 lg:w-200" info href="https://veea.zendesk.com/hc/en-us">
                        Support Center
                    </ExternalLinkButton>
                </div>
            </div>
            <hr className="border-2" />
            <div className="flex">
                <i className="hidden lg:block icon-6_Help font-size-28 mr-20" />
                <div className="flex-grow">
                    <h2 className="mb-10 text-black">Looking for VeeaHub Manager?</h2>
                    <p className="font-thin font-size-14">
                        If you are looking for VeeaHub Manager for iOS or Android, please click the button on the right.
                    </p>
                </div>
                <div className="ml-5 self-center">
                    <ExternalLinkButton className="w-100 lg:w-200" info href="https://www.veea.com/products/cloud-management/veeahub-manager/">
                        Download VHM
                    </ExternalLinkButton>
                </div>
            </div>
            <hr className="border-2" />
            <div className="text-center font-size-12">
                Logged in as <b>{store.view.activeuser.email}</b>
            </div>
            <div className="text-center font-size-12">
                <a className="no-underline hover:underline" href="/logout">Logout</a>
                <span> • </span>
                <a className="no-underline hover:underline" href="/account/change-password?redirectPath=%2F">
                    Change password
                </a>
            </div>
        </Container>
    </>;
});
