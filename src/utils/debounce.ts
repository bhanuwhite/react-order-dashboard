/*
* Debounce the call to the provided function.
* @param {Function} fn function to debounce
* @param {number} durationMilli duration in milliseconds before firing the event again
*/
export function debounce(fn: (ev: MessageEvent) => void, durationMilli: number) {

   let timeoutId = 0;

   return function(this: Window) {
       const self = this;
       const args = arguments;

       clearTimeout(timeoutId);
       timeoutId = window.setTimeout(() => {
           fn.apply(self, args as any);
       }, durationMilli);
   };
}