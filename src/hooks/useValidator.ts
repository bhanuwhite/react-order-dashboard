import { defaultObjFrom } from '@/utils/object-helpers';
import { Dictionary, objectKeys } from '@/utils/types';
import * as React from 'react';


/**
 * A convenient wrapper around React.useState to take validation
 * of the input into account.
 *
 * This helper is intended to be used with `TextField`s.
 *
 *
 * Usage:
 *
 * ```tsx
 * const [ pwdValidatorState, pwdError ] = useTextFieldValidator(pwdValidator);
 *
 * ...
 *
 * <TextField {...pwdValidatorState} />
 * ```
 *
 * @param validator validator used to validate the input
 * @param defaultValue default value for the state.
 */
export function useTextFieldValidator(
    validator: Validator<HTMLInputElement>,
    defaultValue: string = '',
): [FieldValidator<HTMLInputElement>, ErrorState, ValidateNow] {
    return useFieldValidator(validator, defaultValue);
}

/**
 * A convenient wrapper around React.useState to take validation
 * of the input into account.
 *
 * This helper is intended to be used with `Select`s.
 *
 *
 * Usage:
 *
 * ```tsx
 * const [ countryState ] = useSelectFieldValidator(countryValidator);
 *
 * ...
 *
 * <Select {...countryState}>
 *     ...
 * </Select>
 * ```
 *
 * @param validator validator used to validate the input
 * @param defaultValue default value for the state.
 */
export function useSelectFieldValidator(
    validator: Validator<HTMLSelectElement>,
    defaultValue: string = '',
): [FieldValidator<HTMLSelectElement>, ErrorState, ValidateNow] {
    return useFieldValidator(validator, defaultValue);
}

/**
 * A convenient wrapper around React.useState to take validation
 * of the input into account.
 *
 * This helper is intended to be used with `TextField`s and `Select`s.
 *
 *
 * Usage:
 *
 * ```tsx
 * const [ pwdValidatorState, pwdError ] = useFieldValidator(pwdValidator);
 *
 * ...
 *
 * <TextField {...pwdValidatorState} />
 * ```
 *
 * @param validator validator used to validate the input
 * @param defaultValue default value for the state.
 */
export function useFieldValidator<E extends HTMLInputElement | HTMLSelectElement>(
    validator: Validator<E>,
    defaultValue: string = '',
): [FieldValidator<E>, ErrorState, ValidateNow] {

    const [ value, onChange ] = React.useState(defaultValue);

    return useFieldValidatorCtrl<E>(
        validator,
        value,
        onChange,
    );
}

const defaultUseManyFieldValidatorOptions = {
    validateOnFocusOut: false,
    validateOnChange: false,
    onChangeDebounceIntervalMilli: 0,
};

/**
 * An augmented version of `useFieldValidator` that works a bit
 * differently:
 *
 *  - The error is reported only once for the group of fields.
 *  - Validation is redone whenever one of the field changes.
 *
 * @param defaultValues default values with which to initialize state
 * @param validator validator used to validate the input
 * @param options options to configure the validator trigger behavior
 */
export function useManyFieldValidator<K extends string>(
    defaultValues: Dictionary<K, string>,
    validator: AllValidator<K>,
    {
        validateOnFocusOut = defaultUseManyFieldValidatorOptions.validateOnFocusOut,
        validateOnChange = defaultUseManyFieldValidatorOptions.validateOnChange,
        onChangeDebounceIntervalMilli = defaultUseManyFieldValidatorOptions.onChangeDebounceIntervalMilli,
    }: UseManyFieldValidatorOptions = defaultUseManyFieldValidatorOptions,
): UseManyFieldValidatorReturnTuple<K> {

    const [ values, setValues ] = React.useState(defaultValues);
    const [ invalid, setInvalid ] = React.useState(false);
    const [ timeoutId, setTimeoutId ] = React.useState(0);
    const [ errors, setErrors ] = React.useState<Dictionary<K, ErrorState>>(defaultObjFrom(defaultValues, undefined));
    const [ suggested, setSuggested ] = React.useState<Dictionary<K, string>[]>([]);
    const inputRefs = React.useRef(defaultObjFrom<HTMLInputElement | HTMLSelectElement, Dictionary<K, string>, null>(
        defaultValues, null,
    ));

    async function handleValidation(newValues?: typeof values): Promise<[becameInvalid: boolean, prop: K | undefined]> {
        const result = await validator(newValues ?? values, inputRefs.current);
        setInvalid(result.type === 'error');

        const newVal = {} as Dictionary<K, ErrorState>;

        if (result.type === 'error') {
            newVal[result.focusProp] = result.reason;
            setErrors(newVal);
            setSuggested(result.suggested ?? []);
            return [true, result.focusProp];
        } else {
            if (Object.keys(errors).length > 0) {
                setErrors(newVal);
            }
            if (suggested.length > 0) {
                setSuggested([]);
            }
        }
        return [false, undefined];
    }

    function onChange(prop: K) {
        return async (newValue: string) => {
            const newValues = {
                ...values,
                [prop]: newValue,
            };
            setValues(newValues);
            if (validateOnChange) {
                if (onChangeDebounceIntervalMilli > 0) {
                    clearTimeout(timeoutId);
                    setTimeoutId(window.setTimeout(async () => {
                        handleValidation(newValues);
                    }, onChangeDebounceIntervalMilli));
                } else {
                    handleValidation(newValues);
                }
            }
        };
    }

    async function validateNow(focusOnError?: boolean): Promise<boolean> {
        const [becameInvalid, prop] = await handleValidation();

        if (focusOnError && becameInvalid && prop) {
            const el = inputRefs.current[prop];
            el?.focus();
        }

        return !becameInvalid;
    }

    async function fillSuggestedValues(suggestedValues: Dictionary<K, string>) {
        setValues(suggestedValues);
        setSuggested([]);
    }

    function onFocusOut() {
        if (validateOnFocusOut && suggested.length === 0) {
            handleValidation();
        }
    }

    function clearSuggested() {
        setSuggested([]);
    }

    return [
        objectKeys(values).reduce((map, prop) => {

            map[prop] = {
                value: values[prop],
                invalid,
                inputRef: (el) => inputRefs.current[prop] = el,
                onChange: onChange(prop),
                onFocusOut,
            };

            return map;
        }, {} as MapFieldValidator<K>),
        errors,
        validateNow,
        suggested,
        clearSuggested,
        fillSuggestedValues,
    ];
}

interface UseManyFieldValidatorOptions {
    /** if true, inputs will trigger validation `onBlur`. Defaults to false. */
    validateOnFocusOut?: boolean
    /** if true, inputs will trigger validation `onChange`. Defaults to false. */
    validateOnChange?: boolean
    /** the interval in milliseconds the onChange validator should use to debounce if desired. Defaults to 0. */
    onChangeDebounceIntervalMilli?: number
}

type UseManyFieldValidatorReturnTuple<K extends string> = [
    MapFieldValidator<K>,
    Dictionary<K, ErrorState>,
    AsyncValidateNow,
    Dictionary<K, string>[],
    () => void,
    (suggestedValues: Dictionary<K, string>) => void,
];

type AllValidator<K extends string> = (
        values: Dictionary<K, string>,
        els: Dictionary<K, HTMLInputElement | HTMLSelectElement | null>,
    ) => Promise<ValidationResultWithElementToFocus<K>>;

type MapFieldValidator<K extends string> = {
    [key in K]: FieldValidatorWithCallback<HTMLInputElement | HTMLSelectElement>;
};

export type ValidationResultWithElementToFocus<K extends string> =
    ValidationSuccess | ValidationErrorWithElementToFocus<K>;

interface ValidationErrorWithElementToFocus<K extends string> extends ValidationError {
    focusProp: K
    suggested?: Dictionary<K, string>[]
}

/**
 * A helper to validate a text field and update the text field automatically.
 *
 * Basic usage:
 *
 * ```tsx
 * const [ pwdValue, setPwdValue ] = React.useState('');
 * const [ pwdValidatorState, pwdError ] = useFieldValidatorCtrl(pwdValidator, pwdValue, setPwdValue);
 *
 * <TextField {...pwdValidatorState} />
 * ```
 *
 * @param validator validator used to validate the input
 * @param value value of the input
 * @param onChange function to call to update the input.
 */
export function useFieldValidatorCtrl<E extends HTMLSelectElement | HTMLInputElement>(
    validator: Validator<E>,
    value: string,
    onChange: (newValue: string) => void,
): [FieldValidator<E>, ErrorState, ValidateNow] {
    const [ invalid, setInvalid ] = React.useState(false);
    const [ error, setError ] = React.useState<string | undefined>(undefined);
    const inputRef = React.useRef<E | null>(null);

    function onFocusOut() {
        const result = validator(value, inputRef.current!);
        setInvalid(result.type === 'error');
        setError(result.type === 'error' ? result.reason : undefined);
        return result.type === 'error';
    }

    function validateNow(focusOnError?: boolean): boolean {
        const becameInvalid = onFocusOut();

        if (focusOnError && becameInvalid) {
            inputRef.current!.focus();
        }

        return !becameInvalid;
    }

    return [
        {
            value,
            onChange,
            invalid,
            onFocusOut,
            inputRef,
        },
        error,
        validateNow,
    ];
}

type Validator<E> = (value: string, el: E) => ValidationResult;

export type ValidateNow = (focusOnError?: boolean) => boolean;
export type AsyncValidateNow = (focusOnError?: boolean) => Promise<boolean>;

export type ValidationResult = ValidationError | ValidationSuccess;

interface ValidationError {
    type: 'error'
    reason?: string
}

interface ValidationSuccess {
    type: 'success'
}

type ErrorState = string | undefined;

/**
 * Those fields overlap with the one from the TextField component.
 */
interface CommonFieldValidator<E> {
    value: string
    onChange: (newValue: string) => void
    invalid: boolean
    onFocusOut(ev: React.FocusEvent<E>): void
}

interface FieldValidator<E> extends CommonFieldValidator<E> {
    inputRef: React.RefObject<E>
}

export interface FieldValidatorWithCallback<E> extends CommonFieldValidator<E> {
    inputRef: (instance: E | null) => void
}