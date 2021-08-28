import { Modal, Progress, Spinner, SuccessBody, ErrorBody } from '@/components/core';
import { FC } from 'react';
import { UploadError, UploadStage } from '@/store/view/application-upload';


// tslint:disable-next-line: variable-name
export const UploadProgressModal: FC<{
    open: boolean,
    onClose: () => void,
    uploadProgress: number,
    uploadError: UploadError,
    uploadStage: UploadStage,
}> = ({ open, onClose, uploadProgress, uploadError, uploadStage }) => {

    const uploadFinished = uploadStage === UploadStage.ProcessComplete;
    return <Modal noClose={!uploadFinished && !uploadError}
        open={open}
        onClose={onClose}
        centered={true}
        extended={true}>

        {uploadError ? <ErrorBody
            description={
                uploadError.kind === 'generic' ? <span>
                    {uploadError.text}{` `}
                    Please try again or <a href="mailto:devsupport@veea.com">contact us</a>.
                </span> :
                uploadError.kind === 'app-validation' ? <span>
                    Your application hasn't passed our validation checks.{` `}
                    You can verify those errors by running:
                    <code className="block">vhc app --verify "{uploadError.fileName}"</code>
                    If it says your application is valid, please contact <a href="mailto:devsupport@veea.com">
                        devsupport@veea.com
                    </a>.
                </span> :
                null
            }
            onClose={onClose}
        />
            : uploadFinished ? <SuccessBody
                description="Application created successfully!"
                onClose={onClose}
            />
                : <>
                    <h1>Upload in progress</h1>
                    <Spinner />
                    <div className="text-d-grey font-size-14">
                        {uploadStage}. Please do not navigate away during upload.
                    </div>
                    <br />
                    <Progress value={uploadProgress} />
                </>}

    </Modal>;
};