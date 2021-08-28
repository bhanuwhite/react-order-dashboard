import * as React from 'react';
import { FC } from 'react';
import { PageIntro, Separator } from '@/components/core';
import { Container } from '@/components/core';
import { Toggle } from '@/components/core';
import { observer } from 'mobx-react-lite';
import { toggleFeaturePreview } from '@/actions/feature_preview';
import { useStore } from '@/hooks/useStore';
import { FeaturePreviewFlags } from '@/store/view/feature-preview';


// tslint:disable-next-line: variable-name
export const FeaturePreview: FC<Props> = observer(() => {

    const store = useStore();
    const [pendingReq, setPendingReq] = React.useState(false);

    // this makes sure changes to these values in the store cause a re-render
    const { alertSummary, listFilters } = store.view.featurePreview;

    async function onToggleAlertSummary() {
        setPendingReq(true);
        const res = await toggleFeaturePreview(store, FeaturePreviewFlags.AlertSummary);

        if (!res.success) {
            console.error(res.message);
        }
        setPendingReq(false);
    }

    async function onToggleListFilters() {
        setPendingReq(true);
        const res = await toggleFeaturePreview(store, FeaturePreviewFlags.ListFilters);

        if (!res.success) {
            console.error(res.message);
        }
        setPendingReq(false);
    }

    return <>
        <PageIntro title="Feature Preview" icon="icon-107_Light_Off">
            Enhance your experience with our features in preview.
        </PageIntro>
        <Container>
            <Separator
                description="Provide a summary of alerts active on your VeeaHubs."
                sticky
            >
                Alerts
            </Separator>
            <Toggle
                disabled={pendingReq}
                value={alertSummary}
                onChange={onToggleAlertSummary}
            >
                {alertSummary ? 'Alerts are shown' : 'Alerts aren\'t shown'}
            </Toggle>

            <Separator
                description="Add filters to the VeeaHubs and meshes pages."
                sticky
            >
                Filters
            </Separator>
            <Toggle
                disabled={pendingReq}
                value={listFilters}
                onChange={onToggleListFilters}
            >
                {listFilters ? 'Filters are shown' : 'Filters aren\'t shown'}
            </Toggle>
        </Container>
    </>;
});

interface Props {}