// Remembers whether the visitor is using the keyboard or a mouse/touch, so focus is only
// moved back onto graph circles for keyboard users. Moving focus there after a click made
// Safari treat it as keyboard focus, which left the circle and its line highlighted.
let keyboard = false;

if (typeof window !== 'undefined') {
  addEventListener('keydown', (event) => {
    if (!event.metaKey && !event.ctrlKey) keyboard = true;
  }, { capture: true, passive: true });
  addEventListener('pointerdown', () => { keyboard = false; }, { capture: true, passive: true });
}

/**
 * Focus an element the code is returning the visitor to. Graph circles are focused only for
 * keyboard users; everything else (page headings) is focused as usual.
 */
export function restoreFocus(element: HTMLElement | null | undefined, options?: FocusOptions) {
  if (!element) return;
  if (!keyboard && element.closest('.knowledge-graph')) {
    const current = document.activeElement;
    if (current instanceof HTMLElement && current.closest('.knowledge-graph')) current.blur();
    return;
  }
  element.focus(options);
}
