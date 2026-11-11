// A persisted island may update after Astro's swap. Wait for its DOM commit
// without polling and measuring the page on every animation frame.
export function waitForElement<T extends Element>(signal: AbortSignal, find: () => T | null) {
  if (signal.aborted) return Promise.resolve(null);
  const current = find();
  if (current) return Promise.resolve(current);

  return new Promise<T | null>((resolve) => {
    const observer = new MutationObserver(() => {
      const element = find();
      if (element) finish(element);
    });
    const timer = window.setTimeout(() => finish(null), 900);
    const abort = () => finish(null);
    function finish(element: T | null) {
      observer.disconnect();
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      resolve(element);
    }
    observer.observe(document.body, { childList: true, subtree: true, attributes: true,
      attributeFilter: ['data-branch-parent'] });
    signal.addEventListener('abort', abort, { once: true });
  });
}
