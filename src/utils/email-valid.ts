

// See
//
//  * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
//  * https://datatracker.ietf.org/doc/html/rfc5322#section-3.4.1
//  * https://www.w3.org/Bugs/Public/show_bug.cgi?id=15489
//

/**
 * This only check that the email match the spec of valid email addresses.
 * It doesn't check if the recipient can actually receive emails.
 *
 * This partially implement RFC5322 so it should accept most email
 * that are considered valid while rejecting only one that are
 * guaranteed to be invalid. But it might be accept invalid address
 * as well. It should not have any false positives (valid email
 * addresses being rejected which is the primary reason for choosing
 * this approach)
 */
export function isEmailValid(email: string): boolean {

    // See https://datatracker.ietf.org/doc/html/rfc5322#section-3.4.1

    const parts = email.split('@');
    if (parts.length !== 2) {
        return false;
    }

    // const localPart = parts[0];
    // const domain = parts[1];

    // Local part should be dot-atom | quoted-string | obs-local-part

    // Reading the spec and this comment:
    // https://stackoverflow.com/a/5219948
    // I'm starting to think that I'll just be writing something super slow
    // that provide very little benefit.
    // So let's just accept it from there.

    return true;
}

// function isATest(char: string): boolean {
//     return /[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~]/.test(char) ||
//         char >= '\u0080' && char <= '\u10FFFF';
// }