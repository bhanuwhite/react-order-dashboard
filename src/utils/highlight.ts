// We have to have this: https://github.com/highlightjs/highlight.js/issues/2682
// We use a type import to make sure we don't include the entire highlight.js library
import type {} from 'highlight.js';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';


export function highlightBlock(el: HTMLElement) {
    hljs.highlightBlock(el);
}

// Register json
hljs.registerLanguage('json', json);