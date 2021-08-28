import React from 'react';
import { FC } from 'react';
import { Button, ErrorBody } from '@/components/core';
import { SchemaForm } from '@/components/core/SchemaForm';
import * as styles from './packageConfigForm.module.scss';
import { SchemaJson7CustomValidator } from '@/components/core/SchemaFormValidator';
import { isValidJsonSchemaString } from '@/utils/json';

// tslint:disable-next-line: variable-name
export const PackageConfigForm: FC<PackageConfigFormProps> = ({
    onBack,
    onConfirm,
    onClose,
    schema,
    packageConfigData,
    setPackageConfigData,
}) => {

    const submitButtonRef = React.useRef<HTMLButtonElement>(null);

    const onChange = (formData: any) => {
        setPackageConfigData(formData);
    };

    if (!isValidJsonSchemaString(schema)) {
        return <ErrorBody onClose={onClose} description={`There was a problem rendering the package configuration form.
            Please ensure that the packageConfigDataSchema field contains either
            a null value or a valid JSON object string.`
        }/>;
    }

    const parsedSchema: SchemaJson7CustomValidator = JSON.parse(schema);

    return <div className={styles.packageConfigForm}>
        {!parsedSchema.title && <h1>Set Package Configuration Options</h1>}
        {!parsedSchema.title && !parsedSchema.description && <h2 className={styles.defaultFormDescription}>
            This action will configure your application.
        </h2>}

        <SchemaForm
            schema={parsedSchema}
            packageConfigData={packageConfigData}
            onChange={onChange}
            onSubmit={onConfirm}
            submitButtonRef={submitButtonRef} >

            <div style={{ marginTop: '20px' }}>
                <Button wide className={styles.appUpgraderBack} large onClick={onBack}>Go Back</Button>
                <Button type="submit" wide success large forwardedRef={submitButtonRef}>Continue</Button>
            </div>

        </SchemaForm>
    </div>;
};

// tslint:disable-next-line: variable-name
export const PackageConfigFormDataPreview: FC<BasePackageConfigFormProps> = ({
  onBack,
  onConfirm,
  packageConfigData,
}) => {
    const submitButtonRef = React.useRef<HTMLButtonElement>(null);
    const schemaFormDataAsString = packageConfigData ? JSON.stringify(packageConfigData, null, 2) : undefined;
    return <div className={styles.packageConfigForm}>
        <h1>Preview of JSON Schema Form Data</h1>
        <br/>
        <textarea value={schemaFormDataAsString}></textarea>
        <div style={{ marginTop: '20px' }}>
            <Button wide className={styles.appUpgraderBack} large onClick={onBack}>Go Back</Button>
            <Button type="submit" wide success large onClick={onConfirm} forwardedRef={submitButtonRef}>
                Continue
            </Button>
        </div>
    </div>;
};

interface BasePackageConfigFormProps {
    packageConfigData: unknown
    onBack(): void
    onConfirm(): void
}

interface PackageConfigFormProps extends BasePackageConfigFormProps {
    schema: string
    onClose(): void
    setPackageConfigData: React.Dispatch<React.SetStateAction<unknown>>
}