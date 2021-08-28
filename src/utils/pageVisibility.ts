export let pageVisibility: 'visible' | '' = '';

// Set name of hidden property and visibility change event
// since some browsers only offer vendor-prefixed support
let state: string = '';
let visibilityChange: string = '';

if (typeof document.hidden !== 'undefined') {
    visibilityChange = 'visibilitychange';
    state = 'visibilityState';
} else if (typeof (document as any).mozHidden !== 'undefined') {
    visibilityChange = 'mozvisibilitychange';
    state = 'mozVisibilityState';
} else if (typeof (document as any).msHidden !== 'undefined') {
    visibilityChange = 'msvisibilitychange';
    state = 'msVisibilityState';
} else if (typeof (document as any).webkitHidden !== 'undefined') {
    visibilityChange = 'webkitvisibilitychange';
    state = 'webkitVisibilityState';
}
// Add a listener that constantly changes the title
document.addEventListener(visibilityChange, () => {
    pageVisibility = (document as any)[state];
}, false);

// Set the initial value
pageVisibility = (document as any)[state];