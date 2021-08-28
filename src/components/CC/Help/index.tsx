import { SFC } from 'react';
import { Container, HeadTitle } from '@/components/core';
import { PageIntro } from '@/components/core';
import { Separator } from '@/components/core';
// import { OverviewBox } from './OverviewBox';


// tslint:disable-next-line: variable-name
export const Help: SFC<Props> = ({}) => (
<>
    <HeadTitle>Veea Control Center - Help</HeadTitle>
    <PageIntro title="Help Center" icon="icon-6_Help">
        Resources and Help regarding VeeaHubs and the Control Center.
    </PageIntro>
    <Container solid className="p-20">
        <Separator className="ml-5 mt-0 mr-10">Getting Started with Your VeeaHub</Separator>
            <a href="https://www.veea.com/support/article/360017651073/" target="_BLANK">
                {/* <OverviewBox img={`${ASSETS_IMAGES_FOLDER}/help/icon-box.svg`} title="Getting Started">
                    Learn how to connect to and use your VeeaHub.
                </OverviewBox> */}
            </a>
            <a href="https://www.veea.com/support/veeahub/" target="_BLANK">
                {/* <OverviewBox img={`${ASSETS_IMAGES_FOLDER}/help/icon-book.svg`} title="VeeaHub Knowledge Base">
                    Explore articles about VeeaHub.
                </OverviewBox> */}
            </a>
            <a style={{ pointerEvents: 'none', opacity: .4}} href="#" target="_BLANK">
                {/* <OverviewBox img={`${ASSETS_IMAGES_FOLDER}/help/icon-wrench.svg`} title="Developer How-To">
                    Get started with VeeaHub development.<br /><br />(Coming Soon!)
                </OverviewBox> */}
            </a>
        <Separator className="ml-5 mt-0 mr-10">VeeaHub Resources &amp; Tools</Separator>
            <a href="https://www.veea.com/support/section/360003497673/" target="_BLANK">
                {/* <OverviewBox img={`${ASSETS_IMAGES_FOLDER}/help/icon-warn.svg`} title="Troubleshooting">
                    Learn how to troubleshoot problems.
                </OverviewBox> */}
            </a>
            <a href="http://www.veea.com/company/legal/" className="change-tab">
                {/* <OverviewBox img={`${ASSETS_IMAGES_FOLDER}/help/icon-warranty.svg`} title="Warranty &amp; Returns">
                    Information about your VeeaHub warranty and return policies.
                </OverviewBox> */}
            </a>
            <a href="http://www.veea.com/support/" target="_BLANK">
                {/* <OverviewBox img={`${ASSETS_IMAGES_FOLDER}/help/icon-contact.svg`} title="Contact Us">
                    Contact our team for assistance.
                </OverviewBox> */}
            </a>
    </Container>
</>
);
interface Props {}