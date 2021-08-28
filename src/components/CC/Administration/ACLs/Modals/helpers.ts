/**
 * Internally across the backend system and frontend code we use the term ACL
 * instead of what the user sees, "Testing Team"
 * As an interim solution until the term can be changed globally,
 * to prevent the term ACL surfacing in error messages we run this filter.
 *
 * I know.
 *
 * @param errorMessage
 */
export function replaceACLTermWithTestingGroupTerm(errorMessage: string) {
    return errorMessage.replace(/([^\w]|^)[aA][cC][lL]([^\w]|$)/mg, '$1Testing Team$2');
}