import { FC } from 'react';
import { HeadTitle, Separator } from '@/components/core';
import { PageIntro } from '@/components/core';
import { Container } from '@/components/core';
import { HealthStatus } from './HealthStatus';
import { Alerts } from './Alerts';
import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';


// tslint:disable-next-line: variable-name
export const Home: FC<Props> = observer(({}) => {
    const store = useStore();
    const alertSummary = store.view.featurePreview.alertSummary;

    return <>
    <HeadTitle>Veea Control Center - Home</HeadTitle>
    <PageIntro title="Home" icon="icon-168_Home">
        Here you can see the status of all of your deployed meshes and their VeeaHubs.
    </PageIntro>
    <Container dataQaComponent="container">
        <Separator sticky>Overall Health</Separator>
        <HealthStatus />
        {alertSummary ?
            <>
                <Separator className="mt-0"
                        description="Active alerts are updated every 2mins - click an alert slice to view the alerting VeeaHubs"
                        sticky
                    >Alerts
                </Separator>
                <Alerts />
            </> : null}
        <Separator />
    </Container>
    </>;
});
interface Props {}