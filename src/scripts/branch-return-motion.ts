import type { TransitionBeforePreparationEvent, TransitionBeforeSwapEvent } from 'astro:transitions/client';
import { BRANCH_TRAVEL_MS, createBranchAnchor, sweepBranch } from './branch-motion';
import { readBranch } from '../data/branch-location';
import { waitForElement } from './wait-for-element';

interface ReturnMotion {
  parent: string;
  signal: AbortSignal;
  layer: HTMLElement;
  hub: HTMLElement;
  branch: HTMLElement;
  anchor: HTMLElement;
  animations: Set<Animation>;
  paused: Animation[];
  sweep?: ReturnType<typeof sweepBranch>;
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let active: ReturnMotion | undefined;

function cleanup(motion: ReturnMotion) {
  if (active !== motion) return;
  motion.animations.forEach((animation) => animation.cancel());
  if (motion.branch.isConnected) motion.paused.forEach((animation) => animation.play());
  motion.sweep?.cleanup();
  motion.hub.style.removeProperty('visibility');
  motion.branch.inert = false;
  document.querySelector('main[data-branch-return]')?.removeAttribute('data-branch-return');
  motion.layer.hidden = true;
  motion.layer.replaceChildren();
  active = undefined;
}

async function play(motion: ReturnMotion, element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) {
  const animation = element.animate(frames, { ...options, fill: 'forwards' });
  motion.animations.add(animation);
  try { await animation.finished; } catch { /* A new navigation canceled this phase. */ }
}

async function hideBranch(motion: ReturnMotion) {
  const { branch, hub, anchor, layer } = motion;
  branch.inert = true;
  const svg = [...branch.querySelectorAll('svg.branch-edges, svg.branch-mobile-edges')]
    .find((element) => getComputedStyle(element).display !== 'none');
  const edges = [...(svg?.querySelectorAll('.branch-edge') ?? [])];
  const offsets = edges.map((edge) => getComputedStyle(edge).strokeDashoffset);
  await Promise.all(edges.map((edge, index) => play(motion, edge, [
    { strokeDasharray: '1', strokeDashoffset: offsets[index] },
    { strokeDasharray: '1', strokeDashoffset: '1' },
  ], { duration: 280, easing: 'ease-in' })));

  if (active !== motion) return;
  if (!reducedMotion.matches) {
    const nodes = [...branch.querySelectorAll('.branch-children li')].reverse();
    await Promise.all(nodes.map((node, index) => play(motion, node,
      [{ opacity: 1 }, { opacity: 0, scale: '.9' }],
      { duration: 180, delay: index * 130, easing: 'ease-in' })));
  }
  if (active !== motion || reducedMotion.matches) return;
  const current = hub.getBoundingClientRect();
  Object.assign(anchor.style, {
    left: `${current.left}px`, top: `${current.top}px`,
    width: `${current.width}px`, height: `${current.height}px`,
  });
  layer.replaceChildren(anchor);
  layer.hidden = false;
  hub.style.visibility = 'hidden';
}

document.addEventListener('astro:before-preparation', (raw) => {
  const event = raw as TransitionBeforePreparationEvent;
  if (active) cleanup(active);
  const parent = readBranch(event.from.search)?.parent;
  if (reducedMotion.matches || event.from.pathname !== '/' || event.to.pathname !== '/'
    || !parent || readBranch(event.to.search)) return;

  const hub = document.getElementById(`category-${parent}`);
  const branch = document.getElementById(`branch-${parent}`);
  const layer = document.getElementById('branch-return');
  if (!hub || !branch || !layer) return;

  const bounds = hub.getBoundingClientRect();
  if (!bounds.width || bounds.bottom < 0 || bounds.top > innerHeight) return;
  const anchor = createBranchAnchor(hub, bounds);

  const motion: ReturnMotion = { parent, signal: event.signal, layer, hub, branch, anchor,
    animations: new Set(), paused: branch.getAnimations({ subtree: true }).filter(({ playState }) => playState === 'running') };
  // Closing during the reveal must not allow a delayed label to appear again.
  motion.paused.forEach((animation) => animation.pause());
  active = motion;
  event.signal.addEventListener('abort', () => cleanup(motion), { once: true });
  const load = event.loader;
  event.loader = async () => {
    try {
      await Promise.all([load(), hideBranch(motion)]);
      if (event.defaultPrevented || reducedMotion.matches) cleanup(motion);
    } catch (error) {
      cleanup(motion);
      throw error;
    }
  };
});

document.addEventListener('astro:before-swap', (raw) => {
  const event = raw as TransitionBeforeSwapEvent;
  if (active?.signal === event.signal) {
    event.newDocument.querySelector('main')?.setAttribute('data-branch-return', '');
  }
});

document.addEventListener('astro:after-swap', () => {
  if (active) void restoreHome(active);
});

async function restoreHome(motion: ReturnMotion) {
  const graph = await waitForElement(motion.signal, () =>
    document.querySelector<HTMLElement>('#knowledge-graph:has(.graph-primary:not([data-branch-parent]))'));
  if (active !== motion || motion.signal.aborted) return;
  const target = document.getElementById(`category-${motion.parent}`);
  if (!graph || !target) return cleanup(motion);

  graph.dataset.homeRestored = '';
  target.style.removeProperty('visibility');
  target.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  const from = motion.anchor.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (!reducedMotion.matches) {
    await play(motion, motion.anchor, [
      { translate: '0px 0px', scale: '1' },
      {
        translate: `${to.left + to.width / 2 - from.left - from.width / 2}px ${to.top + to.height / 2 - from.top - from.height / 2}px`,
        scale: String(to.width / from.width),
      },
    ], { duration: BRANCH_TRAVEL_MS, easing: 'cubic-bezier(.45,0,.22,1)' });
  }
  if (active !== motion || motion.signal.aborted) return;
  if (!reducedMotion.matches) {
    motion.sweep = sweepBranch(graph, target, 'reveal');
    motion.layer.hidden = true;
    document.querySelector('main')?.removeAttribute('data-branch-return');
    await motion.sweep.finished;
  }
  if (active !== motion) return;
  cleanup(motion);
  target.focus({ preventScroll: true });
}

reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches || !active) return;
  cleanup(active);
});
