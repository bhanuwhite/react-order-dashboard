// Simpler version of
//
//      https://github.com/eligrey/FileSaver.js/blob/b5e61ec88969461ce0504658af07c2b56650ee8c/src/FileSaver.js
//
// In particular we drop support
// which we don't already support

export function downloadUTF8Text(content: string, fileName: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.download = fileName;
    a.rel = 'noopener';
    a.href = URL.createObjectURL(blob);
    setTimeout(() => { URL.revokeObjectURL(a.href); }, 4E4);
    setTimeout(() => { a.click(); }, 0);
}
