import { animateFrames } from './animation-frames';
import { cubicBezier, durations, easings, moveCurve, onLayoutResize, sweepTimeAt } from './motion';

export const PROJECT_HUB_X = 480;

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)');

export function createBranchAnchor(hub: HTMLElement, bounds: DOMRect) {
  const anchor = hub.cloneNode(true) as HTMLElement;
  anchor.removeAttribute('id');
  anchor.inert = true;
  anchor.classList.add('branch-sweep-anchor');
  anchor.setAttribute('aria-expanded', 'true');
  Object.assign(anchor.style, {
    left: `${bounds.left}px`, top: `${bounds.top}px`, width: `${bounds.width}px`, height: `${bounds.height}px`,
    fontSize: getComputedStyle(hub).fontSize, transform: 'none', translate: 'none', scale: '1',
    transition: 'none', animation: 'none',
  });
  return anchor;
}

interface SweepTarget { element: Element; near: number; far: number }

const centerOf = (rect: DOMRect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

// Each graph element fades exactly while the ring's edge crosses it. Fading a
// handful of elements is composited, unlike repainting a mask over the whole graph.
function sweepTargets(graph: HTMLElement, hub: HTMLElement, x: number, y: number) {
  const distance = (point: { x: number; y: number }) => Math.hypot(point.x - x, point.y - y);
  const targets: SweepTarget[] = [];
  const orbit = graph.querySelector<HTMLElement>('.center-orbit');
  const orbitRect = orbit?.getBoundingClientRect();
  for (const element of graph.querySelectorAll<HTMLElement>('.category-node, .relationship, .center-orbit')) {
    if (element === hub) continue;
    const rect = element.getBoundingClientRect();
    // Hidden and off-screen elements need no fade, and must not hold up the swap.
    if (!rect.width || rect.bottom < 0 || rect.top > innerHeight) continue;
    const middle = distance(centerOf(rect));
    const radius = Math.max(rect.width, rect.height) / 2;
    targets.push({ element, near: middle - radius, far: middle + radius });
  }
  for (const edges of graph.querySelectorAll<SVGElement>('.graph-edges')) {
    const node = edges.parentElement?.querySelector('.category-node');
    if (!node || !orbitRect?.width || getComputedStyle(edges).display === 'none') continue;
    const ends = [distance(centerOf(node.getBoundingClientRect())), distance(centerOf(orbitRect))];
    targets.push({ element: edges, near: Math.min(...ends), far: Math.max(...ends) });
  }
  return targets;
}

/** Where the band starts inside the ring element, as a fraction of its radius (see .branch-sweep-ring). */
const RING_INNER = .93;

const settle = (animations: Animation[]) =>
  Promise.all(animations.map(({ finished }) => finished)).then(() => true, () => false);

export interface BranchSweep {
  origin: DOMRect;
  /** Resolves once the ring has passed every graph element (true) or the sweep was cancelled (false). */
  covered: Promise<boolean>;
  /** Resolves when the ring itself has finished. */
  finished: Promise<boolean>;
  /** Hand the hub back to the page and let the ring fade out by itself. */
  release: () => void;
  /** Stop everything immediately and restore the graph. */
  cleanup: () => void;
}

export function sweepBranch(graph: HTMLElement, hub: HTMLElement, direction: 'hide' | 'reveal' = 'hide'): BranchSweep {
  // A ring left over from the previous sweep must not overlap this one.
  document.querySelectorAll('.branch-sweep-overlay').forEach((overlay) => overlay.remove());
  const origin = hub.getBoundingClientRect();
  const bounds = graph.getBoundingClientRect();
  const { x, y } = centerOf(origin);
  const left = Math.max(0, bounds.left);
  const top = Math.max(0, bounds.top);
  const right = Math.min(innerWidth, bounds.right);
  const bottom = Math.min(innerHeight, bounds.bottom);
  // The band's inner edge starts on the clicked node's circle, so the ring visibly
  // leaves from the node itself rather than appearing partway out.
  const startRadius = origin.width / 2 / RING_INNER;
  const radius = Math.max(startRadius + 1,
    Math.hypot(Math.max(x - left, right - x), Math.max(y - top, bottom - y)) + 24);

  const overlay = document.createElement('div');
  overlay.className = 'branch-sweep-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  // The clip softly fades the ring out towards the graph's edges, so it never shows
  // a cut edge and never washes over the intro text beside the graph.
  const clip = document.createElement('div');
  clip.className = 'branch-sweep-clip';
  Object.assign(clip.style, {
    left: `${left}px`, top: `${top}px`, width: `${Math.max(0, right - left)}px`, height: `${Math.max(0, bottom - top)}px`,
  });
  const ring = document.createElement('div');
  ring.className = 'branch-sweep-ring';
  Object.assign(ring.style, {
    left: `${x - left - radius}px`, top: `${y - top - radius}px`, width: `${radius * 2}px`, height: `${radius * 2}px`,
  });
  clip.append(ring);
  const anchor = createBranchAnchor(hub, origin);
  overlay.append(clip, anchor);
  document.body.append(overlay);
  if (direction === 'reveal') graph.dataset.branchRevealing = '';
  else graph.dataset.branchSweeping = '';
  hub.dataset.sweepHub = '';

  const ringAnimation = ring.animate([
    { transform: `scale(${startRadius / radius})`, opacity: 1 },
    { opacity: 1, offset: .8 },
    { transform: 'scale(1)', opacity: 0 },
  ], { duration: durations.sweep, easing: easings.sweep, fill: 'forwards' });
  const fades = sweepTargets(graph, hub, x, y).map(({ element, near, far }) => {
    const start = sweepTimeAt(near, startRadius, radius);
    const end = sweepTimeAt(far, startRadius, radius);
    const timing = { delay: start, duration: Math.max(durations.sweepFade, end - start), easing: 'ease-out' };
    return direction === 'hide'
      ? element.animate([{ opacity: 0 }], { ...timing, fill: 'forwards' })
      : element.animate([{ opacity: 0, offset: 0 }], { ...timing, fill: 'backwards' });
  });
  const covered = settle(fades);
  const finished = settle([ringAnimation, ...fades]);

  const motion = reducedMotion();
  const { scrollX: startX, scrollY: startY } = window;
  let released = false;
  let stopResize = () => {};

  function releaseHub() {
    fades.forEach((animation) => animation.cancel());
    anchor.remove();
    delete graph.dataset.branchSweeping;
    delete graph.dataset.branchRevealing;
    delete hub.dataset.sweepHub;
  }

  function cleanup() {
    ringAnimation.cancel();
    releaseHub();
    overlay.remove();
    motion.removeEventListener('change', onMotionPreferenceChange);
    stopResize();
    window.removeEventListener('scroll', onScroll);
  }

  function release() {
    if (released) return;
    released = true;
    releaseHub();
    void ringAnimation.finished.then(cleanup, cleanup);
  }

  function onMotionPreferenceChange() {
    if (motion.matches) cleanup();
  }

  // Keep the fixed ring attached to the graph instead of cancelling on scroll.
  function onScroll() {
    overlay.style.translate = `${startX - scrollX}px ${startY - scrollY}px`;
  }

  motion.addEventListener('change', onMotionPreferenceChange);
  // A real layout change invalidates the measured geometry. Toolbar resizes do not.
  stopResize = onLayoutResize(cleanup);
  window.addEventListener('scroll', onScroll, { passive: true });
  return { origin, covered, finished, release, cleanup };
}

const moveEase = cubicBezier(...moveCurve);

/**
 * Animate the hub from where the sweep measured it into its branch position.
 * On narrow screens the page scrolls in the same motion, so the hub glides
 * into view instead of the page snapping between sweep and reveal.
 */
export function moveBranchHub(hub: HTMLElement, origin: DOMRect) {
  const destination = hub.getBoundingClientRect();
  let scrollBy = 0;
  if (matchMedia('(max-width: 880px)').matches) {
    const root = document.scrollingElement ?? document.documentElement;
    const wanted = destination.top + destination.height / 2 - innerHeight * .32;
    scrollBy = Math.max(-scrollY, Math.min(root.scrollHeight - innerHeight - scrollY, wanted));
  }
  const from = centerOf(origin);
  const to = centerOf(destination);
  const start = { translate: `${from.x - to.x}px ${from.y - to.y}px`, scale: String(origin.width / destination.width) };
  // The swap that put the hub here is the heaviest frame of the sequence. Hold the hub
  // at its starting pose through it and begin travelling on the next frame, so the
  // first steps of the movement are not lost to that frame.
  Object.assign(hub.style, start);
  const controller = new AbortController();
  let animation: Animation | undefined;
  const frame = requestAnimationFrame(() => {
    hub.style.removeProperty('translate');
    hub.style.removeProperty('scale');
    animation = hub.animate([start, { translate: '0px 0px', scale: '1' }],
      { duration: durations.travel, easing: easings.move });
    if (Math.abs(scrollBy) < 1) return;
    const startY = scrollY;
    const stop = () => controller.abort();
    // The visitor's own scroll gesture wins over the scripted one.
    const gestures = ['wheel', 'touchstart', 'keydown'] as const;
    gestures.forEach((type) => window.addEventListener(type, stop, { passive: true, once: true, signal: controller.signal }));
    void animateFrames(controller.signal, durations.travel, (progress) => {
      window.scrollTo({ left: scrollX, top: startY + scrollBy * moveEase(progress), behavior: 'instant' });
    }).then(stop);
  });
  return {
    cancel() {
      cancelAnimationFrame(frame);
      controller.abort();
      animation?.cancel();
      hub.style.removeProperty('translate');
      hub.style.removeProperty('scale');
    },
  };
}
