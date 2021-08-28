declare module "ajv-errors" {
    import { Ajv } from 'ajv';
    namespace AjvErrors {}
    function AjvErrors(ajv: Ajv, options?: {}): Ajv;
    export = AjvErrors;
}
