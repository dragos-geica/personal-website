import { animateFrames } from './animation-frames';

export const PROJECT_HUB_X = 480;
export const BRANCH_TRAVEL_MS = 620;

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

export function sweepBranch(graph: HTMLElement, hub: HTMLElement, direction: 'hide' | 'reveal' = 'hide') {
  const origin = hub.getBoundingClientRect();
  const bounds = graph.getBoundingClientRect();
  const x = origin.x + origin.width / 2;
  const y = origin.y + origin.height / 2;
  const left = Math.max(0, bounds.left);
  const top = Math.max(0, bounds.top);
  const right = Math.min(innerWidth, bounds.right);
  const bottom = Math.min(innerHeight, bounds.bottom);
  const horizontalReach = Math.max(x - left, right - x);
  const verticalReach = Math.max(y - top, bottom - y);
  const radius = Math.hypot(horizontalReach, verticalReach) + 120;

  const overlay = document.createElement('div');
  overlay.className = 'branch-sweep-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const ring = document.createElement('div');
  ring.className = 'branch-sweep-ring';
  Object.assign(ring.style, {
    left: `${left}px`, top: `${top}px`, width: `${Math.max(0, right - left)}px`, height: `${Math.max(0, bottom - top)}px`,
  });
  ring.style.setProperty('--sweep-center', `${x - left}px ${y - top}px`);

  const anchor = createBranchAnchor(hub, origin);
  overlay.append(ring, anchor);
  document.body.append(overlay);
  if (direction === 'reveal') graph.dataset.branchRevealing = '';
  else graph.dataset.branchSweeping = '';
  hub.dataset.sweepHub = '';
  graph.style.setProperty('--sweep-center', `${x - bounds.left}px ${y - bounds.top}px`);

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const { scrollX: startX, scrollY: startY } = window;
  const finished = animateFrames(controller.signal, 440, (progress) => {
    // Widen the blue band as it travels, leaving the wiped graph behind it.
    const outer = origin.width / 2 + (radius - origin.width / 2) * progress;
    const inner = outer - Math.min(90, 9 + outer * .16);
    graph.style.setProperty('--sweep-inner', `${inner}px`);
    ring.style.setProperty('--sweep-inner', `${inner}px`);
    ring.style.setProperty('--sweep-outer', `${outer}px`);
  });

  function cleanup() {
    controller.abort();
    overlay.remove();
    delete graph.dataset.branchSweeping;
    delete graph.dataset.branchRevealing;
    delete hub.dataset.sweepHub;
    graph.style.removeProperty('--sweep-center');
    graph.style.removeProperty('--sweep-inner');
    reducedMotion.removeEventListener('change', onMotionPreferenceChange);
    window.removeEventListener('resize', cleanup);
    window.removeEventListener('scroll', onScroll);
  }

  function onMotionPreferenceChange() {
    if (reducedMotion.matches) {
      cleanup();
    }
  }

  function onScroll() {
    if (scrollX !== startX || scrollY !== startY) cleanup();
  }

  reducedMotion.addEventListener('change', onMotionPreferenceChange);
  // Resizing invalidates the measured clipping geometry; reveal the real layout.
  window.addEventListener('resize', cleanup, { once: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  return { origin, finished, cleanup };
}

export function moveBranchHub(hub: HTMLElement, origin: DOMRect) {
  if (matchMedia('(max-width: 880px)').matches) {
    const target = hub.getBoundingClientRect();
    window.scrollBy({ top: target.y + target.height / 2 - innerHeight / 2, behavior: 'instant' });
  }
  const destination = hub.getBoundingClientRect();
  const dx = origin.x + origin.width / 2 - destination.x - destination.width / 2;
  const dy = origin.y + origin.height / 2 - destination.y - destination.height / 2;
  return hub.animate([
    { translate: `${dx}px ${dy}px`, scale: String(origin.width / destination.width) },
    { translate: '0px 0px', scale: '1' },
  ], { duration: BRANCH_TRAVEL_MS, easing: 'cubic-bezier(.45,0,.22,1)' });
}
