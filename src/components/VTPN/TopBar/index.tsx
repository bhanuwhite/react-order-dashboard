import * as React from 'react';
import { FC } from 'react';
import styles from './index.module.scss';
import { ExternalLinkButton } from '@/components/core';
import { Link } from 'react-router-dom';
import { DropDown } from './DropDown';
import { useBodyClass } from '@/hooks/useBodyClass';


// tslint:disable-next-line: variable-name
export const TopBar: FC<Props> = ({}) => (
    <header className={`fixed left-0 bkg-white top-0 block ${styles.menu}`} data-qa-id="topbar-menu">
        <PaddingTop />
        <nav className={styles.menuContainer}>
            <MobileMenu />
            <Link to="/" className="block lg:hidden m-auto p-5 h-45" style={{ width: '42px'}}>
                {/* <img src={`${ASSETS_IMAGES_FOLDER}/logo/logo-full-color.svg`} /> */}
            </Link>
            <div className={`block lg:flex items-center flex-grow h-60 ${styles.mobileMenuContainer}`}>
                <Link to="/" className="hidden lg:block">
                    {/* <img src={`${ASSETS_IMAGES_FOLDER}/logo/full-logo.svg`} className={styles.logo} /> */}
                </Link>
                <DropDown links={[
                    ['products/', 'Overview'],
                    ['products/systems/', 'Smart Edge Nodes'],
                    ['products/edge-apps/', 'Edge Services'],
                    ['products/cloud-management/', 'Cloud Management'],
                ]} to="products/">
                    Products
                </DropDown>
                <DropDown links={[
                    ['industries/', 'Overview'],
                    ['industries/smart-stores/', 'Retail'],
                    ['industries/smart-transportation/', 'Transportation'],
                    ['industries/smart-cities/', 'Cities'],
                ]} to="industries/">
                    Industries
                </DropDown>
                <DropDown links={[
                    ['news/', 'News Center'],
                    ['news/news-archive/', 'Press Releases'],
                    ['news/events/', 'Events'],
                    ['news/in-the-news/', 'In the News'],
                ]} to="news/">
                    News &amp; Events
                </DropDown>
                <DropDown links={[
                    ['company/', 'Overview'],
                    ['company/media-kit/', 'Media Kit'],
                    ['company/careers/', 'Careers'],
                    ['company/contact-us/', 'Contact Us'],
                    ['company/legal/', 'Legal'],
                ]} to="company/">
                    Company
                </DropDown>
                <DropDown links={[
                    ['support/', 'Support Center'],
                ]} to="support/">
                    Support
                </DropDown>
                <div className="flex-grow hidden lg:block"></div>
                <ExternalLinkButton primary href="https://www.veea.com/contact-us-demo/" small className="pl-20 pr-20">
                    Contact Us
                </ExternalLinkButton>
            </div>
        </nav>
    </header>
);

interface Props {}


// tslint:disable-next-line: variable-name
const PaddingTop: FC<{}> = () => {
    useBodyClass('pt-45 lg:pt-60');
    return null;
};

// tslint:disable-next-line: variable-name
const MobileMenu: FC<{}> = () => {

    const [ open, setOpen ] = React.useState(false);
    useBodyClass(open ? styles.openMobileMenu : '');

    return <div className={`block lg:hidden absolute ${styles.mobileMenu}`} onClick={() => setOpen(!open)}></div>;
};