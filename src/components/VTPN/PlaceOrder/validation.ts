import { ValidationResult, ValidationResultWithElementToFocus } from '@/hooks/useValidator';
import { Dictionary } from '@/utils/types';
import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

/**
 * Validate an email using the browser checkValidity function.
 * @param email email value.
 * @param el input element
 */
export function emailValidator(email: string, el: HTMLInputElement): ValidationResult {
    if (email.length === 0) {
        return {
            type: 'error',
        };
    }
    if (!el.checkValidity()) {
        return {
            type: 'error',
            reason: 'Must be a valid email address',
        };
    }
    return { type: 'success' };
}

/**
 * Validate a phone number.
 * @param phone phone number to validate
 */
export function phoneValidator(country: CountryCode): (phone: string, el: HTMLInputElement) => ValidationResult {
    return (phone) => {
        if (phone.length === 0) {
            return {
                type: 'error',
            };
        }
        const isValid = isValidPhoneNumber(phone, country);
        if (!isValid) {
            return {
                type: 'error',
                reason: 'Must be a valid phone number',
            };
        }
        return { type: 'success' };
    };
}

/**
 * Validate a value to be non-empty
 * @param value field value
 */
export function notEmptyValidator(value: string): ValidationResult {
    if (!value) {
        return {
            type: 'error',
            reason: 'Cannot be empty',
        };
    }
    return { type: 'success' };
}

/**
 * Password validator
 * @param otherPassword
 */
export const pwdValidator = (minPasswordLength: number) => async (
    values: PwdValidatorProps,
    _els: Dictionary<keyof PwdValidatorProps, HTMLInputElement | HTMLSelectElement| null>,
): Promise<ValidationResultWithElementToFocus<keyof PwdValidatorProps>> => {

    if (!values.password) {
        return {
            type: 'error',
            focusProp: 'password',
        };
    }
    if (values.password.length < minPasswordLength) {
        return {
            type: 'error',
            reason: `Must be at least ${minPasswordLength} characters`,
            focusProp: 'password',
        };
    }
    if (values.confirmPassword !== values.password) {
        return {
            type: 'error',
            reason: 'Passwords must match',
            focusProp: 'confirmPassword',
        };
    }
    return { type: 'success' };
};

interface PwdValidatorProps {
    password: string
    confirmPassword: string
}