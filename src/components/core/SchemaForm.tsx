import React, { useState } from 'react';
import { FC } from 'react';
import { JSONSchema7 } from 'json-schema';
import { default as Form, WidgetProps, FormProps, ArrayFieldTemplateProps, AjvError } from '@rjsf/core';
import { TextField } from '@/components/core/Inputs';
import { Checkbox } from './Checkbox';
import { Button } from './Button';
import { validate, parseErrors, SchemaJson7CustomValidator, CustomSchemaErrors } from './SchemaFormValidator';
import { newIdGenerator } from '@/utils/uniqueId';

// tslint:disable-next-line: variable-name
export const SchemaForm: FC<SchemaFormProps> = ({
    schema,
    packageConfigData,
    submitButtonRef,
    onError,
    onChange,
    onSubmit,
    className,
    tagName = 'form',
    children,
}) => {
    const [ formId ] = React.useState(newId);
    usePreventEnterKeyBehavior(formId, submitButtonRef);
    const [ localFormState, setLocalFormState ] = useState<unknown>(packageConfigData);
    const [ customErrors, setCustomErrors ] = useState({});

    const onFormChange = (props: FormProps<unknown>) => {
        setCustomErrors(parseErrors(validate(schema, props.formData)));

        setLocalFormState(props.formData);
        if (onChange) {
            onChange(props.formData);
        }
    };

    function determineInitialFormData() {
        const schemaIsObjectType = schema.hasOwnProperty('properties');
        return !localFormState && schemaIsObjectType
            ? {}
            : localFormState;
    }

    const initialFormData = determineInitialFormData();

    return <Form
        id={formId}
        className={`schema-form ${className ?? ''}`}
        schema={schema}
        formData={initialFormData}
        onError={onError ?? (() => {})}
        onChange={onFormChange}
        onSubmit={onSubmit}
        omitExtraData={true}
        liveOmit={true}
        tagName={tagName}
        widgets={{
            TextWidget: ConfigTextWidget,
            CheckboxWidget: ConfigCheckboxWidget,
        }}
        ArrayFieldTemplate={ArrayFieldTemplate}
        transformErrors={transformErrors(schema, customErrors)}
        showErrorList={false}
    >
        {children}
    </Form>;
};

// tslint:disable-next-line: variable-name
const ConfigTextWidget: FC<WidgetProps> = (props) => (
    <TextField
        className={props.rawErrors ? 'error' : ''}
        value={props.value ?? ''}
        onChange={props.onChange}
        type={getInputType(props.schema.type)}
    />
);

const newId = newIdGenerator('schemaForm');

// tslint:disable-next-line: variable-name
const ConfigCheckboxWidget: FC<WidgetProps> = (props) => (
    <Checkbox
        onClick={props.onChange}
        checked={props.value}
    >
        {props.label}
    </Checkbox>
);

// tslint:disable-next-line: variable-name
const ArrayFieldTemplate: FC<ArrayFieldTemplateProps> = (props) => {
    const { TitleField, DescriptionField, idSchema: { $id: fieldId }, schema: { description } } = props;

    const renderItemCallback = (item: ArrayFieldTemplateItemProps, i: number) => {
        return <div className="field-array-item" key={i}>
            {item.children}
            <ArrayFieldItemButtons hasMultipleItems={props.items.length > 1} item={item} i={i} />
        </div>;
    };

    return <>
        <TitleField id={`${fieldId}_title`} title={props.title} required={props.required}/>
        {description && <DescriptionField id={`${fieldId}_description`} description={description} />}
        {props.items.map(renderItemCallback)}
        {props.canAdd && <Button className="add-button" type="button" onClick={props.onAddClick}>
            <i className="fas fa-plus"></i>
        </Button>}
    </>;
};

// tslint:disable-next-line: variable-name
const ArrayFieldItemButtons: FC<{ hasMultipleItems: boolean, item: ArrayFieldTemplateItemProps, i: number }> = ({
    hasMultipleItems,
    item,
    i,
}) => {

    const onMoveUpClick = (e: React.MouseEvent<any, MouseEvent>) => item.onReorderClick(i, i - 1)(e);
    const onMoveDownClick = (e: React.MouseEvent<any, MouseEvent>) => item.onReorderClick(i, i + 1)(e);
    const onDeleteClick = (e: React.MouseEvent<any, MouseEvent>) => item.onDropIndexClick(i)(e);
    const addButtonStyle = { width: hasMultipleItems ? 50 : 158 };

    return <div className="button-wrapper">
        {hasMultipleItems && <Button type="button" disabled={!item.hasMoveUp} onClick={onMoveUpClick}>
            <i className="fas fa-arrow-up"></i>
        </Button>}
        {hasMultipleItems && <Button type="button" disabled={!item.hasMoveDown} onClick={onMoveDownClick}>
            <i className="fas fa-arrow-down"></i>
        </Button>}
        {<Button type="button" style={addButtonStyle} disabled={!item.hasRemove} onClick={onDeleteClick}>
            <i className="fas fa-times"></i>
        </Button>}
    </div>;
};

/**
 * Prevent the default form behavior for pressing the enter key.
 * By default the first child button found inside the form is submitted,
 * but in our case of having continue and back buttons, we need the second button to be submitted
 * @param submitButtonRef React ref for the submit button
 */
function usePreventEnterKeyBehavior(formId: string, submitButtonRef?: React.RefObject<HTMLButtonElement>) {
    React.useEffect(() => {
        const handleEnterKeyPress = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'enter') {
                e.preventDefault();
                submitButtonRef?.current?.click();
            }
        };

        const formRef = document.getElementById(formId) as HTMLFormElement;

        if (formRef) {
            formRef.addEventListener('keydown', handleEnterKeyPress);
        }
        return function cleanUp() {
            if (formRef) {
                formRef.removeEventListener('keydown', handleEnterKeyPress);
            }
        };
    }, [submitButtonRef]);
}

/**
 * Provide the field name on the error message if available
 * @param schema JSON schema
 */
const transformErrors =
    (schema: SchemaJson7CustomValidator, customErrors: CustomSchemaErrors) => (errors: AjvError[]) => {
    return errors.map(error => {
        if (schema.properties) {
            /**
             * Array field types will return a error property name of "fieldName[0]"
             * This needs to be parsed in order to obtain the property title,
             * which provides a more descriptive error message.
             */
            const keyArrayBracketsIndex = error.property.substring(1).search(/\[\s*(\d+)\s*\]/g);
            const keyHasArrayBrackets = keyArrayBracketsIndex > -1;
            const errorFieldKey = keyHasArrayBrackets
                ? error.property.substring(1, keyArrayBracketsIndex + 1)
                : error.property.substring(1);

            const property = schema.properties[errorFieldKey] as JSONSchema7;

            if (property?.title) {
                error.message = `${property.title} ${error.message}`;
            }

            const extraError = customErrors[error.property.replace('.', '')];
            if (extraError) {
                error.message = extraError;
            }
        }

        // capitalize first character
        error.message = error.message.charAt(0).toUpperCase() + error.message.slice(1);
        return error;
    });
};

/**
 * Derive the HTML Input type attribute from the JSON Schema type
 * @param schemaType
 */
function getInputType(schemaType: JSONSchema7['type']): 'number' | 'text' | undefined {
    switch (schemaType) {
        case 'number':
        case 'integer':
            return 'number';
        case 'string':
            return 'text';
        default:
            console.error('Unrecognized JSON schema form type', schemaType);
    }
}

interface ArrayFieldTemplateItemProps {
    children: React.ReactElement;
    className: string;
    disabled: boolean;
    hasMoveDown: boolean;
    hasMoveUp: boolean;
    hasRemove: boolean;
    hasToolbar: boolean;
    index: number;
    onAddIndexClick: (index: number) => (event?: any) => void;
    onDropIndexClick: (index: number) => (event?: any) => void;
    onReorderClick: (index: number, newIndex: number) => (event?: any) => void;
    readonly: boolean;
    key: string;
}

interface SchemaFormProps {
    className?: string
    schema: SchemaJson7CustomValidator
    packageConfigData?: unknown
    onSubmit: () => void
    onError?: () => void
    onChange?: (formData: unknown) => void
    submitButtonRef?: React.RefObject<HTMLButtonElement>
    // used to change the default form HTML element type
    tagName?: 'form' | 'div'
}