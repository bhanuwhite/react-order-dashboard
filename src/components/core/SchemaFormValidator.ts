import * as ajvErrors from 'ajv-errors';
import * as Ajv from 'ajv';
import { ErrorObject } from 'ajv';
import { JSONSchema7 } from 'json-schema';

export interface SchemaJson7CustomValidator extends JSONSchema7 {
    errorMessage: {}
}
export interface CustomSchemaErrors {
    [key: string]: string
}

const validator = ajvErrors(new Ajv.default({ allErrors: true }));

export function validate(schema: SchemaJson7CustomValidator, formValues: unknown) {
    const validateFn = validator.compile(schema);
    validateFn(formValues);

    return validateFn.errors;
}

export function parseErrors(errs: ErrorObject[] | null | undefined) {
    if (errs) {
        const errorMessages = errs.filter(e => e.keyword === 'errorMessage');

        if (errorMessages.length) {
            return errorMessages.reduce((acc: CustomSchemaErrors, err: ErrorObject) => {
                const key = err.dataPath.replace('/', '');
                acc = {
                    ...acc,
                    [key]: err.message ?? '',
                };

                return acc;
            }, {});
        }
    }

    return {};
}
