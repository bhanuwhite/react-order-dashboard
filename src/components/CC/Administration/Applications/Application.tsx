import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Prompt, useHistory, useParams } from 'react-router-dom';
import { Button, HeadTitle, Nothing, Select, Separator, Spinner, Toggle, LinkButton } from '@/components/core';
import { CodeBlock } from '@/components/core/CodeBlock';
import { ErrorBox } from '@/components/core/Errors';
import { TextField, FormGroup, TextArea } from '@/components/core/Inputs';
import { SchemaForm } from '@/components/core/SchemaForm';
import { useACLAllFetcher, usePartnerApplicationsFetcher } from '@/hooks/fetchers/acs-endpoints';
import { DEFAULT_JSON_SCHEMA, validateSemanticVersion } from './helpers';
import { ACLInfo } from '@/store/domain/partners';
import { PartnerApplication } from '@/store/domain/partners/applications';
import { UploadProgressModal } from './Modals/UploadProgressModal';
import { EditApplicationModal } from './Modals/EditApplicationModal';
import { mergeFetchers } from '@/fetcher';
import { useStore } from '@/hooks/useStore';
import { validateJSONSchema } from '@/utils/json';
import { APPLICATIONS_LIST_PATH } from './consts';
import styles from './Application.module.scss';
import {
    createApplication,
    updateApplicationMetadata,
    resetApplicationState,
    submitApplicationPayload,
    ApplicationMetadata,
} from '@/actions';
import { UploadStage } from '@/store/view/application-upload';
import { AddACLModal } from '../ACLs/Modals/AddACLModal';


// tslint:disable-next-line: variable-name
export const Application: FC<{ formMode: ApplicationFormModes }> = observer(({ formMode }) => {
    const store = useStore();
    const { applicationId } = useParams<{ applicationId?: string }>();
    const [ aclModalOpen, setACLModalOpen ] = React.useState(false);
    const partnerId = store.view.activeuser.partnerId ?? '';
    const partner = store.domain.partners.map.get(partnerId);
    const existingApplication = partner?.applications.map.get(applicationId ?? '');
    const acls = store.domain.partners.map.get(partnerId)?.acls ?? [];
    const appIsPublic = existingApplication?.public;

    const { loading, error, fetchNow } = mergeFetchers(
        usePartnerApplicationsFetcher(partnerId),
        useACLAllFetcher(partnerId),
    );

    if (
        // If the app does not exists and formode isn't New we need to wait.
        (!existingApplication && formMode !== ApplicationFormModes.New) ||
        // the ACLs are loaded lazily at the bottom of the form when creating a new package
        // so no need to show the spinner in this case
        acls.length === 0 && loading
    ) {
        return <Spinner />;
    }

    if (error) {
        return <ErrorBox className="mt-10 mb-10">{error.message}</ErrorBox>;
    }

    if (!appIsPublic && acls.length === 0) {
        return <Nothing raw>
            <AddACLModal open={aclModalOpen} onClose={() => setACLModalOpen(false)}
                refreshAclList={fetchNow} />
            <div className="mt-5">
                In order to create an Application you first have to create a Testing Team
            </div>
            <div className="mt-10">
                <Button success onClick={() => setACLModalOpen(true)}>
                    <i className="fas fa-plus mr-5"/> Create new Testing Team
                </Button>
            </div>
        </Nothing>;
    }

    return <>
        <HeadTitle>
            Veea Control Center - {!existingApplication ? 'New Application' : existingApplication.title}
        </HeadTitle>
        <AppStatusMessages formMode={formMode} app={existingApplication} />
        <h2 className="font-bold text-dark-grey mt-10 mb-50">
            {formMode === ApplicationFormModes.New && 'New Application'}
            {formMode === ApplicationFormModes.Edit && 'Edit Application'}
            {formMode === ApplicationFormModes.NewVersion && <>
                New Version of <span className="font-light">{existingApplication?.title}</span>
            </>}
        </h2>
        <ApplicationForm formMode={formMode} existingApplication={existingApplication} acls={acls} />
    </>;
});

// tslint:disable-next-line: variable-name
const AppStatusMessages: FC<AppStatusMessagesProps> = observer(({ app, formMode }) => {

    if (formMode === ApplicationFormModes.Edit && app && !app.hasAppContainers) {
        return <>
            <h2 className="font-bold text-offline mt-10">Application submission incomplete</h2>
            <div className="p-20 mb-40 bkg-light-red rounded text-center text-orange">
                This version of <b>{app.title}</b> is missing a valid application binary.{` `}
                You can submit a new one at the bottom of this form.
            </div>
        </>;
    }

    return null;
});

interface AppStatusMessagesProps {
    formMode: ApplicationFormModes
    app?: PartnerApplication
}

// tslint:disable-next-line: variable-name
const ApplicationForm: FC<ApplicationFormProps> = observer(({ existingApplication, acls, formMode }) => {
    const [title, setTitle] = React.useState(existingApplication?.title ?? '');
    const [description, setDescription] = React.useState(existingApplication?.description ?? '');
    const [learnMore, setLearnMore] = React.useState(existingApplication?.learnMore ?? '');
    const [active, setActive] = React.useState(existingApplication?.active ?? true);
    const [version, setVersion] = React.useState(existingApplication?.version ?? '');
    const [features, setFeatures] =
        React.useState(existingApplication?.features ? existingApplication?.features.join('\n') : '');
    const [packageConfigDataSchema, setPackageConfigDataSchema] =
        React.useState<string>(existingApplication?.packageConfigDataSchema ?? DEFAULT_JSON_SCHEMA);
    const [jsonSchemaToggle, setJsonSchemaToggle] = React.useState(!!existingApplication?.packageConfigDataSchema);
    const [aclId, setAclId] = React.useState(existingApplication?.aclId ?? null);
    const [fileName, setFileName] = React.useState('');
    const [progressModalOpen, setProgressModalOpen] = React.useState(false);
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [versionError, setVersionError] = React.useState('');
    const [titleError, setTitleError] = React.useState('');
    const startingVersionIsValid = formMode !== ApplicationFormModes.NewVersion ||
        !validateSemanticVersion(existingApplication?.version, version);
    const [versionIsValid, setVersionIsValid] = React.useState(startingVersionIsValid);
    const [editApplicationError, setEditApplicationError] = React.useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const versionInputRef = React.useRef<HTMLInputElement>(null);

    const originalMetadataState = {
        title: existingApplication?.title ?? '',
        description: existingApplication?.description ?? '',
        learnMore: existingApplication?.learnMore ?? '',
        version: existingApplication?.version ?? '',
        active: existingApplication?.active ?? true,
        features: existingApplication?.features ? existingApplication?.features.join('\n') : '',
        packageConfigDataSchema: existingApplication?.packageConfigDataSchema ?? null,
        aclId: formMode === ApplicationFormModes.New && acls.length > 0
            ? acls[0].id
            : existingApplication?.aclId ?? null,
    };

    const currentMetadataState = {
        title,
        description,
        learnMore,
        version,
        active,
        features,
        packageConfigDataSchema: jsonSchemaToggle ? packageConfigDataSchema : null,
        aclId,
    };

    const metadataHasBeenModified = JSON.stringify(originalMetadataState) !== JSON.stringify(currentMetadataState);

    const store = useStore();
    const history = useHistory();
    const partnerId = store.view.activeuser.partnerId ?? '';
    const uploadStage = store.view.applicationUpload.uploadStage;
    const uploadError = store.view.applicationUpload.uploadError;
    const uploadProgress = store.view.applicationUpload.uploadProgress;
    const existingApplicationNames = store.domain.partners.map.get(partnerId)?.applications.all
        .map(({ title: appTitle }) => appTitle.toLowerCase().trim());

    async function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const versionValidationError = formMode !== ApplicationFormModes.Edit
            && validateSemanticVersion(existingApplication?.version, version);

        if (versionValidationError) {
            setVersionError(versionValidationError);
            versionInputRef.current?.focus();
            return;
        } else {
            setVersionError('');
        }

        const packageMetadata: ApplicationMetadata = {
            persistentUuids: existingApplication?.persistentUuids ?? null,
            firstVersion: formMode === ApplicationFormModes.New,
            title,
            description,
            learnMore,
            active,
            version,
            features: features.split(/\r\n|\r|\n/g).filter(f => f), // split text area string by line breaks
            packageConfigDataSchema: jsonSchemaToggle ? packageConfigDataSchema : null,
            aclId,
        };

        // edit metadata on existing application
        if (formMode === ApplicationFormModes.Edit) {

            if (existingApplication!.hasAppContainers) {

                // Nothing has changed. Do nothing.
                if (!metadataHasBeenModified) {
                    return;
                }

                try {
                    await updateApplicationMetadata(store, partnerId, existingApplication!.id, packageMetadata);
                    setEditModalOpen(true);
                } catch (e) {
                    setEditApplicationError(e.message);
                    setEditModalOpen(true);
                }
            } else {

                const updatedMetadata = metadataHasBeenModified ? packageMetadata : undefined;

                // Application is missing its binary. Restart the upload from there.
                const filesList = fileInputRef.current?.files ?? [];
                setProgressModalOpen(true);
                await submitApplicationPayload(
                    store,
                    partnerId,
                    existingApplication!.id,
                    filesList[0],
                    updatedMetadata,
                );
            }
        } else { // create new or create new version

            const filesList = fileInputRef.current?.files ?? [];
            setProgressModalOpen(true);
            await createApplication(store, partnerId, packageMetadata, filesList[0]);
        }
    }

    React.useEffect(() => {
        // manually set the lazy loaded aclId so that the ACL select menu defaults to a valid ID
        if (formMode === ApplicationFormModes.New || formMode === ApplicationFormModes.NewVersion) {
            setAclId(acls[0].id);
        }
    }, [ acls ]);

    React.useEffect(() => {
        if (formMode === ApplicationFormModes.NewVersion) {
            versionInputRef?.current?.focus();
        }
    }, []);

    function onModalClose() {
        setProgressModalOpen(false);
        setEditModalOpen(false);
        setEditApplicationError('');
        resetApplicationState(store);

        // Redirect to applications list screen to see your handywork
        if (formMode === ApplicationFormModes.Edit || uploadStage === UploadStage.ProcessComplete) {
            history.push(APPLICATIONS_LIST_PATH);
        }
    }

    function onFileInputClick() {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    function onFileInputChange() {
        const filesList = fileInputRef.current?.files ?? [];
        if (filesList.length > 0) {
            setFileName(filesList[0].name);
        } else {
            setFileName('');
        }
    }

    function setVersionWithValidation(value: string) {
        setVersion(value);
        const valid = formMode !== ApplicationFormModes.NewVersion ||
            !validateSemanticVersion(existingApplication?.version, value);
        setVersionIsValid(valid);
    }

    function onTitleChange(val: string) {
        setTitle(val);
        if (existingApplicationNames?.includes(val.toLowerCase().trim())) {
            setTitleError(`Application name "${val}" is already in use`);
        } else {
            setTitleError('');
        }
    }

    const packageUUID = existingApplication?.persistentUuids && existingApplication.persistentUuids.length > 0
        ? existingApplication.persistentUuids[0]
        : '';

    const versionDescriptionMessage = formMode !== ApplicationFormModes.Edit
        ? <>e.g. 1.0.0, 1.0.0-AnyText, 1.0.0-rc.1+build.1
            {formMode === ApplicationFormModes.NewVersion && <>
                <br/>Current version is {existingApplication?.version}
            </>}
        </>
        : ``;

    const metadataIsFrozen = existingApplication?.public && formMode === ApplicationFormModes.Edit;

    return <form onSubmit={onFormSubmit} className={styles.newApplicationForm}>
        <Prompt
            when={metadataHasBeenModified && uploadStage !== UploadStage.ProcessComplete}
            message="Are you sure you want to leave? This form has been modified and any changes will be lost."
        />
        <div className={styles.packageFormRow}>
            <FormGroup className={styles.packageFormGroupHalf}
                label="Application Name"
                description="Application name must be unique">
                <TextField className={styles.packageFormTextField}
                    disabled={[ ApplicationFormModes.Edit, ApplicationFormModes.NewVersion ].includes(formMode)}
                    required
                    value={title}
                    onChange={onTitleChange}
                    label="MyFirstApp™"
                    invalid={!!titleError}
                />
                {titleError && <div className="text-offline font-size-14">{titleError}</div>}
            </FormGroup>
            <FormGroup className={styles.packageFormGroupHalf}
                label="Description">
                <TextField className={styles.packageFormTextField}
                    disabled={metadataIsFrozen}
                    value={description}
                    onChange={setDescription}
                    label="For those just getting started"
                />
            </FormGroup>
        </div>
        <div className={styles.packageFormRow}>
            <FormGroup className={styles.packageFormGroupHalf}
                label="Learn More URL">
                <TextField className={styles.packageFormTextField}
                    disabled={metadataIsFrozen}
                    value={learnMore}
                    onChange={setLearnMore}
                    label="https://www.yourdomain.com/learn-more"
                />
            </FormGroup>
            <FormGroup className={styles.packageFormGroupHalf}
                label={<>
                    Version number
                    <a target="_blank" rel="noreferrer" href="https://semver.org" className="ml-15 mb-10">
                        <i className="fas fa-external-link-alt mr-5"/>
                        Learn more
                    </a>
                </>}
                description={versionDescriptionMessage}>
                <TextField disabled={formMode === ApplicationFormModes.Edit} className={styles.packageFormTextField}
                    value={version}
                    onChange={setVersionWithValidation}
                    label="0.0.0"
                    inputRef={versionInputRef}
                    invalid={!!versionError || !versionIsValid}
                    required
                />
                {versionError && <div className="text-offline font-size-14">{versionError}</div>}
            </FormGroup>
        </div>
        <div className={styles.packageFormRow}>
            <FormGroup className={styles.packageFormGroupHalf}
                label="Active">
                <Toggle value={active} onChange={setActive} />
            </FormGroup>
        </div>
        <div className={`${styles.packageFormRow} mb-0`}>
            <FormGroup className={styles.packageFormGroupFull}
                label="Features (one per line)">
                <TextArea disabled={metadataIsFrozen} label={<>
                    VeeaFi Public Wifi<br/>
                    4 GB of Data<br/>
                    Free Support<br/>
                </>}
                className={styles.featuresTextArea}
                value={features}
                onChange={setFeatures} />
            </FormGroup>
        </div>
        {[ ApplicationFormModes.Edit, ApplicationFormModes.NewVersion ].includes(formMode) && <>
            <Separator className="mt-5 mb-5 ml-0"/>
            <div className={`${styles.packageFormRow} mb-0`}>
                <FormGroup className={styles.packageFormGroupHalf}
                    label="Package UUID">
                    <TextField disabled className={styles.packageFormTextField}
                        value={packageUUID}
                        onChange={() => {}}
                    />
                </FormGroup>
            </div>
        </>}
        <Separator className="mt-5 mb-5 ml-0"/>
        <JSONSchema jsonSchemaToggle={jsonSchemaToggle}
            metadataIsFrozen={metadataIsFrozen}
            setJsonSchemaToggle={setJsonSchemaToggle}
            packageConfigDataSchema={packageConfigDataSchema}
            setPackageConfigDataSchema={setPackageConfigDataSchema}
        />
        {aclId !== null && <>
            <Separator className="mt-5 mb-5 ml-0"/>
            <div className={`${styles.packageFormRow} mb-0`}>
                <FormGroup className={styles.packageFormGroupHalf}
                    label="Testing Team">
                    <Select value={aclId} onChange={setAclId} required>
                        {acls.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                </FormGroup>
            </div>
        </>}
        {(formMode !== ApplicationFormModes.Edit || existingApplication && !existingApplication.hasAppContainers) && <>
            <Separator className="mt-5 mb-5 ml-0"/>
            <div className={styles.packageFormRow}>
                <FormGroup className={styles.packageFormGroupFull}
                    label="Application Binary Upload">
                    <a className={`${styles.uploadFileButton} flat-btn`}
                        style={{ cursor: 'pointer' }}
                        onClick={onFileInputClick}>
                        <i className="fas fa-plus-circle" style={{ color: '#268733' }} />
                        <b>Upload file</b>
                        {fileName && <span className={styles.displayedFileName}>{fileName}</span>}
                    </a>
                    <input required className={styles.hiddenFileUploadInput} type="file"
                        onChange={onFileInputChange} ref={fileInputRef}/>
                </FormGroup>
            </div>
        </>}
        <div className={styles.submitButtonRow}>
            <LinkButton large type="button" to={APPLICATIONS_LIST_PATH}>
                Cancel
            </LinkButton>
            <Button disabled={existingApplication?.hasAppContainers && !metadataHasBeenModified}
                type="submit" large success>
                {formMode === ApplicationFormModes.Edit && 'Save Changes'}
                {formMode === ApplicationFormModes.New && 'Create New Application'}
                {formMode === ApplicationFormModes.NewVersion && 'Create New Version'}
            </Button>
        </div>
        <UploadProgressModal
            open={progressModalOpen}
            uploadError={uploadError}
            uploadStage={uploadStage}
            onClose={onModalClose}
            uploadProgress={uploadProgress}
        />
        <EditApplicationModal
            open={editModalOpen}
            error={editApplicationError}
            onClose={onModalClose}
        />
    </form>;
});

interface ApplicationFormProps {
    existingApplication?: PartnerApplication,
    acls: ACLInfo[],
    formMode: ApplicationFormModes
}

export enum ApplicationFormModes {
    New,
    Edit,
    NewVersion,
}

// tslint:disable-next-line: variable-name
const JSONSchema: FC<JSONSchemaProps> = ({
    metadataIsFrozen,
    jsonSchemaToggle,
    setJsonSchemaToggle,
    packageConfigDataSchema,
    setPackageConfigDataSchema,
}) => {

    const [ previewValue, setPreviewValue ] = React.useState<unknown>({});
    const heightRef = React.useRef<number>(0);
    const formDivRef = React.useRef<HTMLDivElement | null>(null);

    const isValidJSON = validateJSONSchema(packageConfigDataSchema);

    React.useLayoutEffect(() => {
        if (formDivRef && formDivRef.current) {
            const currentHeight = formDivRef.current.offsetHeight;
            if (heightRef.current < currentHeight) {
                heightRef.current = currentHeight;
            }
            formDivRef.current.style.minHeight = `${heightRef.current}px`;
        }
    });

    return <div className="flex">
        <FormGroup className="w-1/3 flex flex-col flex-shrink-0"
            label={<div className="flex items-center justify-between">
                <div className="pb-15 pt-15">
                    JSON schema (optional)
                    <a target="_blank" rel="noreferrer" href="https://json-schema.org" className="ml-15">
                        <i className="fas fa-external-link-alt mr-5"/>
                        Learn more
                    </a>
                </div>
                <Toggle value={jsonSchemaToggle} onChange={setJsonSchemaToggle} disabled={metadataIsFrozen} />
            </div>}>
            {jsonSchemaToggle && <TextArea
                disabled={metadataIsFrozen}
                className="font-mono w-full h-full m-0"
                value={packageConfigDataSchema ?? ''}
                invalid={!isValidJSON.success}
                onChange={setPackageConfigDataSchema}
            />}
        </FormGroup>
        {jsonSchemaToggle && <>
            <FormGroup className="w-5/12 ml-25 mr-5 flex flex-col" label={<div className="pb-15 pt-15">Preview</div>}>
                <div ref={formDivRef} className="p-15 rounded border border-solid border-lighter-grey h-full">
                    {isValidJSON.success && <SchemaForm className="p-0 m-0"
                        onChange={(val) => setPreviewValue(val)}
                        schema={JSON.parse(packageConfigDataSchema ?? '')}
                        onSubmit={() => {}}
                        tagName="div">
                        <Button className={styles.jsonSchemaPreviewSubmitButton} onClick={e => e.preventDefault()} type="submit" wide success large>
                            Submit
                        </Button>
                    </SchemaForm>}
                    {!isValidJSON.success && <span className="text-offline">{isValidJSON.reason}</span>}
                </div>
            </FormGroup>
            <FormGroup className="w-3/12 ml-20 flex flex-col"
                label={<div className="pb-15 pt-15">Form data value</div>}
            >
                <CodeBlock className="p-15 rounded border border-solid font-size-14 border-lighter-grey h-full">
                    {JSON.stringify(previewValue, undefined, 2)}
                </CodeBlock>
            </FormGroup>
        </>}
    </div>;
};

interface JSONSchemaProps {
    metadataIsFrozen: boolean | undefined

    jsonSchemaToggle: boolean
    setJsonSchemaToggle: (newValue: boolean) => void

    packageConfigDataSchema: string
    setPackageConfigDataSchema: (newValue: string) => void
}