import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const Footer: FC<{}> = ({}) => (
    <div id="footer" className="w-full flex flex-col p-0 bkg-grey-245 pb-40 lg:pb-90">
        <div className="w-full hidden lg:flex flex-col pt-20 border-t border-solid border-light-grey">
            <div className="m-auto mt-20 mb-30">
                <a href="https://www.veea.com/">
                    {/* tslint:disable-next-line: max-line-length */}
                    {/* <img src={`${ASSETS_IMAGES_FOLDER}/footer/slogan.png`} className="mb-10" style={{ height: '15px', width: '196px' }} /> */}
                </a>
            </div>
            <div className="flex justify-center mb-30 w-11/12 m-auto max-width-1300">
                <FooterSection to="/products/edge-apps" name="Edge Services" subLinks={[]} />
                <FooterSection to="/products/systems" name="Smart Edge Nodes" subLinks={[
                    ['/products/systems/veeahub-pro-outdoor', 'VeeaHub Pro Outdoor'],
                    ['/products/systems/veeahub-pro-s', 'VeeaHub Pro S'],
                    ['/products/systems/veeahub-pro', 'VeeaHub Pro'],
                    ['/products/systems/veeahub', 'VeeaHub'],
                ]} />
                <FooterSection to="/products/cloud-management" name="Cloud Management" subLinks={[
                    ['/products/cloud-management/veea-control-center', 'Veea Control Center'],
                    ['/products/cloud-management/veeahub-manager', 'VeeaHub Manager'],
                ]} />
                <FooterSection to="/industries/" name="Industries" subLinks={[
                    ['/industries/smart-stores/', 'Retail'],
                    ['/industries/smart-transportation/', 'Transportation'],
                    ['/industries/smart-cities/', 'Cities'],
                ]} />
                <FooterSection to="/company/" name="Company" subLinks={[
                    ['/company/media-kit/', 'Media Kit'],
                    ['/company/careers/', 'Careers'],
                    ['/company/contact-us/', 'Contact Us'],
                    ['/company/legal/', 'Legal'],
                ]} />
                <FooterSection to="/support/" name="Support" subLinks={[]} />
            </div>
        </div>
        <div className="font-size-11 pt-60 lg:pt-40 border-solid border-t border-lighter-grey w-11/12 p-20 lg:p-0 m-auto max-width-1300 flex flex-col lg:flex-row justify-between items-center text-center lg:text-left">
            <div>
                {/* tslint:disable-next-line: max-line-length */}
                <p className="text-grey">Copyright © 2018 - {new Date().getFullYear()} Veea Inc. All Rights Reserved.</p>
                <p>Veea and VeeaHub are trademarks of Veea Inc.</p>
                <p>All other trademarks and tradenames are the property of their respective owners.</p>
            </div>
            <div className="font-size-22 mt-30 lg:mt-0">
                <SocialLink to="https://www.linkedin.com/company/veea" icon="linkedin" />
                <SocialLink to="https://www.facebook.com/veeahq/" icon="facebook" />
                <SocialLink to="https://twitter.com/VeeaHQ" icon="twitter" />
                <SocialLink to="https://www.youtube.com/channel/UCMHsN1tzA3jGKapkYXOo-Ng" icon="youtube" />
            </div>
        </div>
    </div>
);

// tslint:disable-next-line: variable-name
const FooterSection: FC<SectionProps> = ({ name, to, subLinks }) => (
    <div className="font-size-12 text-center w-1/6">
        <a className="font-bold inline-block no-underline mb-10 text-d-grey hover:underline" href={`https://www.veea.com${to}`}>{name}</a>
        <ul className="font-size-11">
            {subLinks.map(([subLinkTo, subLinkName], i) =>
                <li key={i}>
                    <a href={`https://www.veea.com${subLinkTo}`} className="mb-10 inline-block no-underline text-grey hover:underline">
                        {subLinkName}
                    </a>
                </li>,
            )}
        </ul>
    </div>
);

interface SectionProps {
    name: string
    to: string
    subLinks: [to: string, name: string][]
}

// tslint:disable-next-line: variable-name
const SocialLink: FC<SocialLinkProps> = ({ to, icon }) => (
    <a target="_blank" rel="noreferrer" href={to} className="text-d-grey ml-15 hover:text-black p-10 lg:p-0">
        <i className={`fab fa-${icon}`} />
    </a>
);

interface SocialLinkProps {
    icon: string
    to: string
}