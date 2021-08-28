import { FC } from 'react';
import { MeshPackageState } from '@/store/domain/enrollment';
import { Button, ActionModal } from '@/components/core';
import { resumeSubscription } from '@/actions/subscriptions';
import * as style from './UnsubscribeModal.module.scss';
import { useStore } from '@/hooks/useStore';
import { StripeSubscriptionState } from '@/store/domain/account';


// tslint:disable-next-line: variable-name
export const ResumeSubscriptionModal: FC<Props> = ({ sub, pkg, open, onClose }) => {
    const store = useStore();
    return <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                text: 'Resume Subscription',
                type: 'primary' as const,
                run: async () => {
                    const res = await resumeSubscription(store, [ sub!.id ]);
                    if (res.success) {
                        const summary = 'Your mesh subscription has been resumed.';
                        const description = 'You will continue be billed each month until you unsubscribe from the associated service.';
                        return {
                            success: true,
                            summary,
                            description,
                        };
                    } else {
                        return {
                            success: false,
                            summary: 'We couldn\'t resume your subscription.',
                            description: `There was an error ${res.message}`,
                        };
                    }
                },
            },
        ]}
        renderBtn={({ text, onClick, type }) =>
            <Button wide large onClick={onClick}
                className={style.btn}
                disabled={!pkg || !sub}
                success={type === 'success' || type === 'primary'}
                error={type === 'error'}
            >{type === 'default' ? 'Go Back' : text}</Button>
        }
    >
        <h1>Resume Subscription</h1>
        <h2>Are you sure you want to resume your subscription to this service?</h2>
        <hr />
        <h2 className={style.description}>
            Your subscription will be resumed and you will be billed each month until you cancel the associated service.
        </h2>
    </ActionModal>;
};

interface Props {
    pkg: MeshPackageState
    sub: StripeSubscriptionState
    open: boolean
    onClose: () => void
}