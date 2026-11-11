import type { TransitionBeforePreparationEvent, TransitionBeforeSwapEvent } from 'astro:transitions/client';
import { readBranch } from '../data/branch-location';
import { graphNodes } from '../data/graph';
import { nodeDestination } from '../data/node-destinations';
import { animateFrames } from './animation-frames';
import { waitForElement } from './wait-for-element';

type Surface = 'node' | 'heading' | 'preview';
type FindTarget = () => HTMLElement | null;

interface Pose {
  x: number;
  y: number;
  w: number;
  h: number;
  labelX: number;
  labelY: number;
  labelWidth: number;
  labelOffsetX: number;
  labelOffsetY: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
  textWrap: string;
  color: string;
  strokeOpacity: number;
}

interface Morph {
  controller: AbortController;
  signal: AbortSignal;
  reverse: boolean;
  from: Surface;
  to: Surface;
  findTarget: FindTarget;
  swapped: boolean;
  layer: HTMLElement;
  labels: [HTMLSpanElement, HTMLSpanElement];
  outline: SVGPathElement;
  start: Pose;
  source: HTMLElement;
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const nodeSelector = '[data-morph-node]';
const headingSelector = '[data-morph-heading]';
const previewSelector = '[data-morph-preview]';
let focusRoute: { signal: AbortSignal; findTarget: FindTarget } | undefined;
let morph: Morph | undefined;
const contentAnimations = new Set<Animation>();

const lerp = (a: number, b: number, progress: number) => a + (b - a) * progress;
const ease = (progress: number) => progress * progress * (3 - 2 * progress);

function getPose(element: HTMLElement, surface: Surface): Pose {
  const heading = surface !== 'node';
  const label = element.querySelector<HTMLElement>('.branch-label') ?? element;
  const styles = getComputedStyle(label);
  const range = document.createRange();
  range.selectNodeContents(label);
  const text = range.getBoundingClientRect();
  const box = element.getBoundingClientRect();
  const labelBox = label.getBoundingClientRect();
  const labelX = text.left + text.width / 2;
  const labelY = text.top + text.height / 2;
  return {
    x: box.left + (heading ? Math.min(box.width, 460) : box.width) / 2,
    y: heading ? box.bottom + 7 : box.top + box.height / 2,
    w: heading ? Math.min(box.width, 460) : box.width,
    h: heading ? 0 : box.height,
    labelX,
    labelY,
    labelWidth: parseFloat(styles.width) || labelBox.width,
    labelOffsetX: labelBox.left - labelX,
    labelOffsetY: labelBox.top - labelY,
    fontSize: parseFloat(styles.fontSize),
    fontFamily: styles.fontFamily,
    fontWeight: styles.fontWeight,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    textAlign: styles.textAlign,
    textWrap: styles.textWrap,
    color: styles.color,
    strokeOpacity: surface === 'preview' ? 0 : 1,
  };
}

function styleLabel(label: HTMLSpanElement, pose: Pose, element: HTMLElement) {
  label.textContent = element.textContent?.trim() ?? '';
  Object.assign(label.style, {
    width: `${pose.labelWidth}px`, fontSize: `${pose.fontSize}px`, fontFamily: pose.fontFamily,
    fontWeight: pose.fontWeight, lineHeight: pose.lineHeight, letterSpacing: pose.letterSpacing,
    textAlign: pose.textAlign, textWrap: pose.textWrap, color: pose.color,
  });
}

function draw(shot: Morph, from: Pose, to: Pose, progress: number, flatten: number, fill: number) {
  const { outline, labels } = shot;
  const x = lerp(from.x, to.x, progress);
  const y = lerp(from.y, to.y, progress);
  const width = lerp(from.w, to.w, progress);
  const height = lerp(from.h, to.h, progress);
  // Open the circle from the top and flatten the remaining arc from left to right.
  const sweep = lerp(Math.PI * 2, Math.PI, flatten);
  let path = '';
  for (let index = 0; index <= 32; index++) {
    const t = index / 32;
    const angle = Math.PI / 2 + sweep * (.5 - t);
    const px = x + lerp(Math.cos(angle) / 2, t - .5, flatten) * width;
    const py = y + Math.sin(angle) * height / 2 * (1 - flatten);
    path += `${index ? 'L' : 'M'}${px.toFixed(2)} ${py.toFixed(2)} `;
  }
  outline.setAttribute('d', path);
  outline.style.fillOpacity = String(fill);
  outline.style.strokeOpacity = String(lerp(from.strokeOpacity, to.strokeOpacity, progress));
  outline.style.strokeWidth = String(lerp(1.35, 1, flatten));
  const labelX = lerp(from.labelX, to.labelX, progress);
  const labelY = lerp(from.labelY, to.labelY, progress);
  const fontSize = lerp(from.fontSize, to.fontSize, progress);
  const crossfade = ease(Math.min(1, Math.max(0, (progress - .42) / .16)));
  // Each label keeps its original line breaks. Only its layer moves and scales.
  const place = (label: HTMLSpanElement, pose: Pose, opacity: number) => {
    label.style.opacity = String(opacity);
    if (opacity > 0) label.style.transform = `translate(${labelX}px, ${labelY}px) scale(${fontSize / pose.fontSize}) translate(${pose.labelOffsetX}px, ${pose.labelOffsetY}px)`;
  };
  place(labels[0], from, 1 - crossfade);
  place(labels[1], to, crossfade);
}

function animate(shot: Morph, duration: number, frame: (progress: number) => void) {
  return animateFrames(shot.controller.signal, duration, frame);
}

const normalized = (path: string) => path.replace(/\/$/, '');

function findNode(pathname: string) {
  return document.querySelector<HTMLElement>(`[data-morph-node="${CSS.escape(normalized(pathname))}/"]`);
}

function routeInBranch(search: string, pathname: string) {
  const branch = readBranch(search);
  const category = graphNodes.find(({ id }) => id === branch?.parent);
  const matches = (label: string) => category && normalized(nodeDestination(category.id, label)) === normalized(pathname);
  return {
    child: category?.children.some(matches),
    preview: Boolean(branch?.selected && matches(branch.selected)),
  };
}

function clean(shot: Morph) {
  if (morph !== shot) return;
  shot.controller.abort();
  shot.source.removeAttribute('data-morph-source');
  shot.layer.hidden = true;
  shot.layer.replaceChildren();
  document.querySelector('[data-morph-source]')?.removeAttribute('data-morph-source');
  const main = document.querySelector<HTMLElement>('[data-morph-main]');
  main?.style.removeProperty('opacity');
  main?.removeAttribute('data-morph-main');
  morph = undefined;
}

function cancelContentAnimations() {
  contentAnimations.forEach((animation) => animation.cancel());
  contentAnimations.clear();
}

function settleMorph() {
  if (!morph) return;
  const shot = morph;
  clean(shot);
  if (!shot.swapped) return;
  void waitForElement(shot.signal, shot.findTarget).then((target) => {
    if (!shot.signal.aborted) target?.focus({ preventScroll: true });
  });
}

reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches) return;
  cancelContentAnimations();
  settleMorph();
});
window.addEventListener('resize', settleMorph);

document.addEventListener('astro:before-preparation', (raw) => {
  const event = raw as TransitionBeforePreparationEvent;
  cancelContentAnimations();
  if (morph) clean(morph);
  focusRoute = undefined;
  const history = event.navigationType === 'traverse';
  let source: HTMLElement | null = null;
  let from: Surface = 'node';
  let to: Surface = 'heading';
  let findTarget: FindTarget = () => document.querySelector(headingSelector);
  const reverse = event.to.pathname === '/' && event.from.pathname !== '/';
  if (reverse && (history || event.sourceElement?.closest('[data-morph-back]'))) {
    const route = routeInBranch(event.to.search, event.from.pathname);
    if (!route.child) return;
    source = document.querySelector(headingSelector);
    from = 'heading';
    to = route.preview ? 'preview' : 'node';
    findTarget = route.preview ? () => document.querySelector(previewSelector) : () => findNode(event.from.pathname);
  } else if (event.from.pathname === '/' && event.to.pathname !== '/') {
    const preview = event.sourceElement?.closest('[data-morph-open]')
      || (history && routeInBranch(event.from.search, event.to.pathname).preview);
    source = preview ? document.querySelector(previewSelector)
      : event.sourceElement?.closest<HTMLElement>(nodeSelector) ?? (history ? findNode(event.to.pathname) : null);
    from = preview ? 'preview' : 'node';
  }
  focusRoute = source ? { signal: event.signal, findTarget } : undefined;
  const layer = document.querySelector<HTMLElement>('#node-morph');
  if (!source || !layer || reducedMotion.matches) return;
  const bounds = source.getBoundingClientRect();
  if (!bounds.width || bounds.bottom < 0 || bounds.top > innerHeight || getComputedStyle(source).visibility === 'hidden') return;

  layer.innerHTML = '<svg width="100%" height="100%"><path/></svg><span></span><span></span>';
  const shot: Morph = {
    controller: new AbortController(),
    signal: event.signal, reverse, from, to, findTarget, swapped: false,
    layer, source, start: getPose(source, from),
    labels: [layer.querySelector('span:first-of-type')!, layer.querySelector('span:last-of-type')!],
    outline: layer.querySelector('path')!,
  };
  morph = shot;
  styleLabel(shot.labels[0], shot.start, source);
  layer.hidden = false;
  source.setAttribute('data-morph-source', '');
  document.querySelector('main')?.setAttribute('data-morph-main', 'leaving');
  event.signal.addEventListener('abort', () => clean(shot), { once: true });
  const load = event.loader;
  event.loader = async () => {
    try {
      await Promise.all([load(), animate(shot, reverse ? 240 : 440, (time) => {
        draw(shot, shot.start, shot.start, 0, from === 'node' ? ease(Math.max(0, time - .5) * .58) : 1,
          from === 'node' ? 1 - ease(Math.min(1, time * 1.7)) : 0);
      })]);
      if (event.defaultPrevented || !event.newDocument.querySelector('main')) clean(shot);
    } catch (error) {
      clean(shot);
      throw error;
    }
  };
});

document.addEventListener('astro:before-swap', (raw) => {
  const event = raw as TransitionBeforeSwapEvent;
  // A newer navigation can skip Astro’s native snapshot while the swap is pending.
  void event.viewTransition.ready.catch((error: unknown) => {
    if (!(error instanceof DOMException && error.name === 'AbortError')) console.error(error);
  });
  // The custom morph owns the visual handoff. A native snapshot can paint the old graph again.
  event.viewTransition.skipTransition();
  const main = event.newDocument.querySelector('main');
  if (morph && morph.signal === event.signal) main?.setAttribute('data-morph-main', 'arriving');
  if (event.to.pathname === '/') {
    const branch = readBranch(event.to.search);
    const visibleBranch = document.querySelector<HTMLElement>('.graph-primary')?.dataset.branchParent;
    if (branch && branch.parent !== visibleBranch) main?.setAttribute('data-graph-pending', '');
  }
});

document.addEventListener('astro:after-swap', () => {
  const shot = morph;
  const focus = focusRoute;
  focusRoute = undefined;
  if (shot && !shot.signal.aborted) {
    shot.swapped = true;
    void finish(shot);
  } else if (focus) {
    const { signal, findTarget } = focus;
    void waitForElement(signal, findTarget).then((target) => {
      if (!signal.aborted) target?.focus();
    });
  }
});

async function finish(shot: Morph) {
  const target = await waitForElement(shot.controller.signal, shot.findTarget);
  if (morph !== shot || shot.signal.aborted) return;
  const main = document.querySelector('main');
  if (target) {
    if (shot.reverse) target.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    const end = getPose(target, shot.to);
    styleLabel(shot.labels[1], end, target);
    if (shot.reverse) target.setAttribute('data-morph-source', '');
    // Expand a short underline into the divider while the title settles.
    const shortWidth = Math.min(end.w, 100);
    await animate(shot, shot.reverse ? 720 : 850, (time) => {
      const move = ease(Math.min(1, time / .72));
      const flatten = shot.to === 'node' ? 1 - ease(time)
        : shot.from === 'node' ? lerp(ease(.29), 1, ease(Math.min(1, time / .75))) : 1;
      const underlineWidth = lerp(shortWidth, end.w, ease(Math.max(0, (time - .55) / .45)));
      const endPose = shot.reverse ? end : {
        ...end,
        w: underlineWidth,
        x: end.x - (end.w - underlineWidth) / 2,
      };
      draw(shot, shot.start, endPose, move, flatten, shot.to === 'node' ? ease(Math.max(0, (time - .7) / .3)) : 0);
      if (shot.reverse && main) main.style.opacity = String(ease(Math.max(0, (time - .62) / .38)));
    });
  }
  if (morph !== shot) return;
  clean(shot);
  if (target) target.focus({ preventScroll: true });
  if (main && !shot.reverse && target) {
    const children = [...main.children].filter((element) => element !== target);
    children.forEach((element, index) => {
      const animation = element.animate([{ opacity: 0, transform: 'translateY(7px)' }, { opacity: 1, transform: 'none' }],
        { duration: 380, delay: Math.min(index, 5) * 48, fill: 'backwards', easing: 'ease-out' });
      contentAnimations.add(animation);
      void animation.finished.then(() => contentAnimations.delete(animation), () => contentAnimations.delete(animation));
    });
  }
}
