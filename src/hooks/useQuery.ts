import { useLocation } from 'react-router';

/**
 * Return the query string of the current search.
 */
export function useQuery() {
    return new URLSearchParams(useLocation().search);
}