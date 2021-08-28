import { EnrollmentDeviceState } from '@/store/domain/enrollment';

export function prettyBoolean(value: boolean | undefined) {
    if (value === undefined) {
        return 'Unknown';
    }
    return value ? 'Yes' : 'No';
}

export function acsStatus(esData?: EnrollmentDeviceState) {
    let val = 'N/A';
    if (esData) {
        val = esData.status;
        if (esData.progress !== null) {
            val += ' (' + esData.progress + '%)';
        }
    }
    return val;
}

export function acsError(esData?: EnrollmentDeviceState) {
    let val = 'N/A';
    if (esData && esData.error !== null) {
        val = esData.error.message ?? 'Unknown';
    }
    return val;
}

/**
 * @param fileName Name of new file to be downloaded
 * @param text Text content
 * @returns {DOMString} Can be used to cleanup the source object from the DOM
 */
export function downloadTextFile(fileName: string, text: string): string {
    const mimeType = 'text/plain';
    const blob = new Blob([ text ], { type: mimeType });
    const tempAnchor = document.createElement('a');
    tempAnchor.download = fileName;
    const objectUrl = URL.createObjectURL(blob);
    tempAnchor.href = objectUrl;
    tempAnchor.dataset.downloadurl = [ mimeType, tempAnchor.download, tempAnchor.href ].join(':');
    tempAnchor.style.display = 'none';
    document.body.appendChild(tempAnchor);
    tempAnchor.click();
    document.body.removeChild(tempAnchor);
    return objectUrl;
}