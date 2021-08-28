import { FC } from 'react';
import { ErrorBody, Modal, Spinner } from '@/components/core';


// tslint:disable-next-line: variable-name
export const PlaceOrderResponseModal: FC<Props> = ({ open, loading, errorMessage, onClose }) => (
    <Modal extended centered open={open} title={loading ? 'Placing Order' : ''} noClose onClose={onClose}>
        {errorMessage ? <ErrorBody onClose={onClose} description={errorMessage} /> : <Spinner />}
    </Modal>
);

interface Props {
    open: boolean
    loading: boolean
    errorMessage: string
    onClose: () => void
}