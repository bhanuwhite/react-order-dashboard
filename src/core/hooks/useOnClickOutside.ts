import * as React from "react";

/**
 * Register an event handler when clicking outside.
 * Should be use with `React.useCallback` for best perf result.
 *
 * @param ref reference to dom element.
 * @param onClickOutside onClickOutside called when the clicked occured outside. This should be stable across render
 *     to avoid triggering the useEffect hook too many times.
 */
export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  onClickOutside?: () => void
) {
  React.useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      // FIXME: are we sure this cast is correct?
      if (
        ev.target &&
        ref.current &&
        !ref.current.contains(ev.target as Node)
      ) {
        onClickOutside?.();
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [ref, onClickOutside]);
}

/**
 * Register an event handler when clicking outside a set of DOM elements.
 * Should be use with `React.useCallback` for best perf result.
 * The array of refs does not need to be stable across renders.
 *
 * @param onClickOutside onClickOutside called when the clicked occured outside. This should be stable across render
 *     to avoid triggering the useEffect hook too many times and registering/unregister event listeners
 * @param refs references to dom elements.
 */
export function useOnClickOutsideManyRefs(
  onClickOutside: () => void,
  ...refs: React.RefObject<HTMLElement>[]
) {
  React.useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      // FIXME: are we sure this cast is correct?
      if (
        ev.target &&
        refs.every(
          (ref) => ref.current && !ref.current.contains(ev.target as Node)
        )
      ) {
        onClickOutside();
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [...refs, onClickOutside]);
}

// function contains(el: HTMLElement, ev: MouseEvent): boolean {
//     const bounds = el.getBoundingClientRect();
//     return (
//         ev.clientX > bounds.x && ev.clientX < bounds.x + bounds.width &&
//         ev.clientY > bounds.y && ev.clientY < bounds.y + bounds.height
//     );
// }
