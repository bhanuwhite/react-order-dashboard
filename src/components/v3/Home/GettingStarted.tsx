import * as React from 'react';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { Section } from '../core';


// tslint:disable-next-line: variable-name
export const GettingStarted: FC<Props> = observer(({}) => {

    const store = useStore();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    const hasPartner = store.view.activeuser.hasPartnerAdminFeature;

    const linkClassName = 'font-bold no-underline hover:underline text-primary';

    return <Section title="Getting Started" className="mx-4 md:mx-0"
        infoLink={{ kind: 'tooltip', text: 'TODO' }}
    >
        <div className="text-sm space-y-3">
            <GSLink icon="icon-25_Devices text-purple-600"
                text="Download VeeaHub Manager (iOS/Android) to manage/enroll VeeaHub(s)"
            >
                <a className={linkClassName} href="https://www.veea.com/products/cloud-management/veeahub-manager/">
                    Download
                </a>
            </GSLink>
            <GSLink icon="icon-138_Certificate text-primary"
                text="Select a VeeaHub to get the Azure certificate for it"
            >
                <Link className={linkClassName} to={`/${selectedGroupId}/devices`}>
                    View Nodes
                </Link>
            </GSLink>
            <GSLink icon="icon-67_Rocket text-pink-600"
                text={`To subscribe to a service, view a mesh and select "Subscriptions"`}
            >
                <Link className={linkClassName} to={`/${selectedGroupId}/meshes`}>
                    View Meshes
                </Link>
            </GSLink>
            <GSLink icon="icon-7_Settings_Android text-red-600"
                text="To manage users and groups, visit Administration"
            >
                <Link className={linkClassName} to={`/${selectedGroupId}/settings/groups`}>
                    Administration
                </Link>
            </GSLink>
            <GSLink icon="icon-11_My_Profile text-green-600"
                text="To manage your account, visit My Account"
            >
                <Link className={linkClassName} to={`/${selectedGroupId}/settings/account`}>
                    My Account
                </Link>
            </GSLink>
            {hasPartner && <GSLink icon="icon-75_Developer_Mode text-gray-500"
                text="To develop applications for your VeeaHubs, visit the Developer Center"
            >
                <Link className={linkClassName} to={`/applications`}>
                    Developers
                </Link>
            </GSLink>}
            <GSLink icon="icon-6_Help text-yellow-600"
                text="For more information, visit the Help Center"
            >
                <Link className={linkClassName} to="/help">
                    Help Center
                </Link>
            </GSLink>
        </div>
    </Section>;
});

interface Props {}

// tslint:disable-next-line: variable-name
const GSLink: FC<{ icon: string, text: React.ReactNode }> = ({ icon, text, children }) => (
    <div className="rounded-md bg-gray-100/50 flex items-center p-3">
        <i className={`text-2xl -mt-2 -mb-2  mr-4 ml-1 ${icon}`} />
        <span className="flex-grow mr-2">{text}</span>
        {children}
    </div>
);