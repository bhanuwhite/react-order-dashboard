import { parseErrors } from './SchemaFormValidator';
import { ErrorObject } from 'ajv';

describe('SchemaFormValidator', () => {
    it('should parse schema errors when custome validation error message are assigned to properties', () => {
        const errors: ErrorObject[] = [{
            keyword: 'errorMessage',
            dataPath: '/ssid_name',
            params: {
                missingProperty: 'ssid_name',
            },
            schemaPath: '#/required',
            message: 'only alphanumeric values',
        },
        {
            keyword: 'errorMessage',
            dataPath: '/ssid_password',
            params: {
                missingProperty: 'ssid_password',
            },
            schemaPath: '#/required',
            message: 'password min length is 8',
        }];

        const parsedErrors = parseErrors(errors);
        expect(parsedErrors).toEqual({
            ssid_name: 'only alphanumeric values',
            ssid_password: 'password min length is 8',
        });
    });

    it(`should parse schema errors when multiple validation error message are assigned,
        only the last found should be displayed`, () => {
        const errors: ErrorObject[] = [{
            keyword: 'errorMessage',
            dataPath: '/ssid_name',
            params: {
                missingProperty: 'ssid_name',
            },
            schemaPath: '#/required',
            message: 'only alphanumeric values',
        },
        {
            keyword: 'errorMessage',
            dataPath: '/ssid_name',
            params: {
                missingProperty: 'ssid_name',
            },
            schemaPath: '#/required',
            message: 'min value 3 characters',

        },
        {
            keyword: 'errorMessage',
            dataPath: '/ssid_password',
            params: {
                missingProperty: 'ssid_password',
            },
            schemaPath: '#/required',
            message: 'password min length is 8',
        }];

        const parsedErrors = parseErrors(errors);
        expect(parsedErrors).toEqual({
            ssid_name: 'min value 3 characters',
            ssid_password: 'password min length is 8',
        });
    });
});
