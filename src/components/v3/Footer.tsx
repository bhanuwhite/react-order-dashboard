import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const Footer: FC<Props> = ({}) => (
    <div className="hidden lg:block mt-12 w-full mb-12">
        <div className="flex justify-between text-xs text-gray-500 font-bold">
            <div className="space-x-3">
                <ExtLink href="https://www.veea.com/company/legal/terms-of-use/">Service Status</ExtLink>
                <ExtLink href="https://www.veea.com/about/contact/">Contact Us</ExtLink>
            </div>
            <div className="space-x-3">
                <ExtLink href="https://www.veea.com/company/legal/terms-of-use/">Terms of Use</ExtLink>
                <ExtLink href="https://www.veea.com/company/legal/privacy-policy/">Privacy Policy</ExtLink>
                <ExtLink href="https://www.veea.com/company/legal/end-user-license-agreement/">EULA</ExtLink>
                <ExtLink href="https://www.veea.com/company/legal/warranty/">Limited Warranty</ExtLink>
                <ExtLink href="https://www.veea.com/company/legal/4g-failover-terms-of-use/">4G Failover Terms</ExtLink>
            </div>
        </div>
        <div className="flex items-start justify-between mt-4 text-gray-400" style={{ fontSize: '0.65rem', lineHeight: '1rem' }}>
            <div>
                <p className="font-bold">
                    © 2018 - {new Date().getFullYear()} Veea Inc. All Rights Reserved.
                </p>
                <p>
                    VeeaHub is a trademarks of Veea Inc.{' '}
                    All other trademarks and tradenames are the property of their respective owners.
                </p>
            </div>
            <div>Control Center Build {process.env.EC_VERSION}</div>
        </div>
    </div>
);

interface Props {}

// tslint:disable-next-line: variable-name
const ExtLink: FC<{ href: string }> = ({ href, children }) => (
    <a href={href} className="no-underline hover:underline">{children}</a>
);