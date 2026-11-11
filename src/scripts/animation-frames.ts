// Resolve cancellation immediately, even when rAF is throttled in a background tab.
export function animateFrames(signal: AbortSignal, duration: number, draw: (progress: number) => void) {
  return new Promise<boolean>((resolve) => {
    let frame = 0;
    let settled = false;
    const start = performance.now();
    function finish(complete: boolean) {
      if (settled) return;
      settled = true;
      cancelAnimationFrame(frame);
      signal.removeEventListener('abort', abort);
      resolve(complete);
    }
    const abort = () => finish(false);
    function tick(now: number) {
      if (settled) return;
      const progress = Math.min(1, (now - start) / duration);
      draw(progress);
      if (!settled && progress < 1) frame = requestAnimationFrame(tick);
      else finish(true);
    }
    if (signal.aborted) return finish(false);
    signal.addEventListener('abort', abort, { once: true });
    draw(0);
    if (!settled) frame = requestAnimationFrame(tick);
  });
}
