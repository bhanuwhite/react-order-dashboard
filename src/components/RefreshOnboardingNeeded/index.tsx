import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { updateOnboardingNeededState } from '@/actions/refresh-session';


// tslint:disable-next-line: variable-name
export const RefreshOnboardingNeeded: FC<Props> = observer(({}) => {

    const store = useStore();
    const isLoggedIn = store.view.activeuser.isLoggedIn;
    const groupCount = store.view.activeuser.groupsInToken.length;

    React.useEffect(() => {

        if (isLoggedIn) {
            // The group count has changed. Let's refresh the onboarding needed state
            updateOnboardingNeededState(store);
        }

    }, [ groupCount, isLoggedIn ]);

    return null;
});

interface Props {}
