import { SFC } from 'react';


// tslint:disable-next-line: variable-name
export const Footer: SFC<Props> = ({}) => (
    <div id="footer" className="wrapper">
        <div className="footer-left">
            <b>© 2018 - {new Date().getFullYear()} Veea Inc. All Rights Reserved.</b>
            Veea, VeeaHub, VeeaPay, VeeaConnect and vCube, are trademarks of Veea Inc.<br />
            All other trademarks and tradenames are the property of their respective owners.
        </div>
        <div className="footer-right">
            <a href="https://www.veea.com/company/legal/terms-of-use/">Terms of Use</a>
            <a href="https://www.veea.com/company/legal/privacy-policy/">Privacy Policy</a>
            <a href="https://www.veea.com/company/legal/end-user-license-agreement/">EULA</a>
            <a href="https://www.veea.com/company/legal/warranty/">Warranty</a>
            <a href="https://www.veea.com/company/legal/4g-failover-terms-of-use/">4G Failover Terms</a>
            <a href="https://www.veea.com/about/contact/">Contact Us</a>
            <div className="mt-10 font-size-10">Control Center Build {process.env.EC_VERSION}</div>
        </div>
    </div>
);
interface Props {}