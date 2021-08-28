import { Modal, SuccessBody, ErrorBody } from '@/components/core';
import { FC } from 'react';

// tslint:disable-next-line: variable-name
export const EditApplicationModal: FC<EditModalProps> = ({ open, onClose, error }) => <Modal
    open={open}
    onClose={onClose}
    centered={true}
    extended={true}>
        {error ? <ErrorBody description={error} onClose={onClose} /> : <SuccessBody
            description="Changes saved successfully!"
            onClose={onClose}
        />}
</Modal>;

interface EditModalProps {
  open: boolean,
  onClose: () => void,
  error: string,
}