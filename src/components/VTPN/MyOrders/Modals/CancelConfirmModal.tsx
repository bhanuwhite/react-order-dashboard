import { FC } from 'react';
import { ActionModal } from '@/components/core';
import { ErrorOrSuccessProps } from '@/components/core/ActionModal';


// tslint:disable-next-line: variable-name
export const CancelConfirmModal: FC<ConfirmModalProps> = ({
    run,
    open,
    onClose,
    children,
}) => (
    <ActionModal open={open} extended centered cancelBtnText="Go Back" actions={[
            {
                text: 'Cancel',
                type: 'primary' as const,
                run,
            },
        ]}
        style={{ maxWidth: '650px' }}
        onClose={onClose}
    >
        {children}
    </ActionModal>
);

interface ConfirmModalProps {
  run(): Promise<ErrorOrSuccessProps>
  onClose(): void
  open: boolean
}