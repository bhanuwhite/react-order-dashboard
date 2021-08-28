
export function getGroupColumnFromQuery(query: URLSearchParams): 'contact' | 'name' | 'veeahub' {
    const value = query.get('kind');
    switch (value) {
        case 'contact': return value;
        case 'name': return value;
        case 'veeahub': return value;
        default: return 'name';
    }
}