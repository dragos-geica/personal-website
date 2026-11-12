// The portrait's easter egg. Clicking it plays a stuttering whoosh while the portrait
// shakes harder and harder in step with the sound; at the sound's peak it bursts, and
// a ring of light clears everything else off the screen. Clicking it again, or Escape,
// brings the page back.
import { playSound } from './branch-sound';
import { cubicBezierInverse } from './motion';

/** Loudness of public/sounds/portrait-burst.m4a in 25 ms steps (0–1), measured from the file. */
const ENVELOPE = [
  .01, .01, .01, .03, .03, .01, .02, .04, .02, .02, .05, .05, .01, .09, .08, .03, .03, .08, .06, .02,
  .09, .11, .07, .05, .11, .09, .05, .1, .17, .04, .12, .24, .14, .07, .22, .26, .07, .14, .28, .28,
  .15, .32, .28, .24, .65, .41, .57, .69, .28, .95, .75, .75, .98, .4, .96, .93, .98, 1, 1, .99,
  .99, .99, .99, .99, .99, 1, .94, .47, .28, .32, .3, .15, .19, .12, .06, .03, .03, .01, 0,
];
const STEP = 25;
/** The sound's sustained peak: the moment the portrait bursts. */
const BURST_AT = 1360;
/** The ring takes the rest of the sound to clear the screen. */
const RING = 640;
/** Restoring the page: the light pulls back in. */
const RESTORE = 520;
/** Fast out, long settle: an explosion rather than a sweep. */
const BURST_CURVE = [.12, .7, .3, 1] as const;
const burstInverse = cubicBezierInverse(...BURST_CURVE);
/** Matches the band's inner edge in .branch-sweep-ring. */
const RING_INNER = .93;

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Run { cancel: () => void }
let running: Run | null = null;

const scene = () => document.querySelector<HTMLElement>('main.home-scene');

function loudness(time: number) {
  const position = time / STEP;
  const index = Math.floor(position);
  const a = ENVELOPE[Math.min(index, ENVELOPE.length - 1)] ?? 0;
  const b = ENVELOPE[Math.min(index + 1, ENVELOPE.length - 1)] ?? 0;
  return a + (b - a) * (position - index);
}

/** Everything the burst clears, with how far its nearest and farthest edges are from the portrait. */
function targets(x: number, y: number) {
  const elements = [...document.querySelectorAll<HTMLElement>('.home-intro, .graph-categories > .category, .center-orbit > .orbit')];
  return elements.flatMap((element) => {
    const parts = element.classList.contains('category')
      ? [...element.querySelectorAll<HTMLElement>('.category-node, .relationship')] : [element];
    const rects = parts.map((part) => part.getBoundingClientRect()).filter(({ width }) => width);
    if (!rects.length) return [];
    const left = Math.min(...rects.map((rect) => rect.left));
    const right = Math.max(...rects.map((rect) => rect.right));
    const top = Math.min(...rects.map((rect) => rect.top));
    const bottom = Math.max(...rects.map((rect) => rect.bottom));
    const near = Math.hypot(Math.max(left - x, 0, x - right), Math.max(top - y, 0, y - bottom));
    const far = Math.hypot(Math.max(x - left, right - x), Math.max(y - top, bottom - y));
    return [{ element, near, far }];
  });
}

/**
 * A vibration pattern that follows the sound on phones that support it (Android; iPhone
 * browsers do not allow websites to vibrate). Phones cannot vary strength, so the build-up
 * is pulses that grow longer with each stutter, and the burst is one long buzz.
 */
function vibrationPattern() {
  const pattern: number[] = [];
  const slot = 100;
  for (let time = 0; time < BURST_AT; time += slot) {
    const on = Math.round(8 + Math.max(...ENVELOPE.slice(time / STEP, (time + slot) / STEP)) * 70);
    pattern.push(on, slot - on);
  }
  pattern.push(380);
  return pattern;
}

function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Some browsers throw instead of ignoring the request.
  }
}

function geometry(portrait: HTMLElement) {
  const bounds = portrait.getBoundingClientRect();
  const x = bounds.left + bounds.width / 2;
  const y = bounds.top + bounds.height / 2;
  const startRadius = bounds.width / 2 / RING_INNER;
  const radius = Math.max(startRadius + 1, Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 24);
  const timeAt = (distance: number) =>
    RING * burstInverse(Math.min(1, Math.max(0, (distance - startRadius) / (radius - startRadius))));
  return { bounds, x, y, startRadius, radius, timeAt };
}

function ringOverlay(x: number, y: number, radius: number) {
  const overlay = document.createElement('div');
  overlay.className = 'branch-sweep-overlay portrait-burst-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  const rings = [0, 1].map((index) => {
    const ring = document.createElement('div');
    ring.className = `branch-sweep-ring${index ? ' portrait-burst-echo' : ''}`;
    Object.assign(ring.style, {
      left: `${x - radius}px`, top: `${y - radius}px`, width: `${radius * 2}px`, height: `${radius * 2}px`,
    });
    return ring;
  });
  overlay.append(...rings);
  document.body.append(overlay);
  return { overlay, rings };
}

function burst(portrait: HTMLElement) {
  const main = scene();
  if (!main || running) return;
  const reduced = reducedMotion();
  const animations: Animation[] = [];
  let frame = 0;
  let timer = 0;
  let overlay: HTMLElement | undefined;
  let cancelled = false;

  function resetPortrait() {
    portrait.style.removeProperty('translate');
    portrait.style.removeProperty('rotate');
  }

  const run: Run = {
    cancel() {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      animations.forEach((animation) => animation.cancel());
      overlay?.remove();
      resetPortrait();
      vibrate(0);
      delete main.dataset.portraitBurst;
      main.style.removeProperty('--charge');
      if (running === run) running = null;
    },
  };
  running = run;
  main.dataset.portraitBurst = '';

  // Start the motion when the sound actually starts, so the two stay in step.
  void playSound('burst', { volume: .7, wait: 400 }).then(() => {
    if (cancelled) return;
    const start = performance.now();
    vibrate(vibrationPattern());

    function charge(now: number) {
      const time = now - start;
      if (time >= BURST_AT) return explode();
      const build = (time / BURST_AT) ** 1.6;
      main!.style.setProperty('--charge', build.toFixed(3));
      if (!reduced) {
        // A video-game shake: random every frame, harder with each stutter in the sound.
        const amplitude = .6 + loudness(time) * 7 + build * 2.5;
        const jitter = () => (Math.random() * 2 - 1) * amplitude;
        portrait.style.translate = `${jitter().toFixed(2)}px ${jitter().toFixed(2)}px`;
        portrait.style.rotate = `${(jitter() * .45).toFixed(2)}deg`;
      }
      frame = requestAnimationFrame(charge);
    }
    frame = requestAnimationFrame(charge);
  });

  function explode() {
    resetPortrait();
    main!.style.setProperty('--charge', '1');
    const { bounds, x, y, startRadius, radius, timeAt } = geometry(portrait);
    const fades = targets(x, y).map(({ element, near, far }) => {
      const [from, to] = reduced ? [0, 260] : [timeAt(near), timeAt(far)];
      return element.animate([{ opacity: 0 }], { delay: from, duration: Math.max(180, to - from), easing: 'ease-out', fill: 'forwards' });
    });
    animations.push(...fades);

    if (!reduced) {
      // The portrait pops, a flash leaves it, the screen jolts, and the light rings out.
      animations.push(portrait.animate([{ scale: 1 }, { scale: 1.17, offset: .25 }, { scale: .96, offset: .6 }, { scale: 1 }],
        { duration: 560, easing: 'cubic-bezier(.2,.8,.3,1)' }));
      const flash = document.createElement('div');
      flash.className = 'portrait-burst-flash';
      Object.assign(flash.style, {
        left: `${bounds.left}px`, top: `${bounds.top}px`, width: `${bounds.width}px`, height: `${bounds.height}px`,
      });
      const ring = ringOverlay(x, y, radius);
      overlay = ring.overlay;
      overlay.append(flash);
      animations.push(flash.animate([{ opacity: .95, scale: .9 }, { opacity: 0, scale: 2.8 }],
        { duration: 460, easing: 'cubic-bezier(.1,.7,.3,1)', fill: 'forwards' }));
      const small = `scale(${startRadius / radius})`;
      ring.rings.forEach((element, index) => animations.push(element.animate([
        { transform: small, opacity: 1 },
        { opacity: 1, offset: .75 },
        { transform: 'scale(1)', opacity: 0 },
      ], { duration: RING + index * 120, delay: index * 110, easing: `cubic-bezier(${BURST_CURVE.join(',')})`, fill: 'both' })));
      const jolt = [0, 1, 2, 3].map(() => `${(Math.random() * 12 - 6).toFixed(1)}px ${(Math.random() * 10 - 5).toFixed(1)}px`);
      animations.push(main!.animate([{ translate: '0 0' }, ...jolt.map((translate) => ({ translate })), { translate: '0 0' }],
        { duration: 260, easing: 'linear' }));
    }

    timer = window.setTimeout(() => {
      // Hand over to the resting state; it keeps everything hidden without animations.
      main!.dataset.portraitEgg = '';
      portrait.setAttribute('aria-pressed', 'true');
      animations.forEach((animation) => animation.cancel());
      overlay?.remove();
      delete main!.dataset.portraitBurst;
      main!.style.removeProperty('--charge');
      if (running === run) running = null;
    }, reduced ? 300 : RING + 260);
  }
}

function restore(portrait: HTMLElement) {
  const main = scene();
  if (!main || running) return;
  const reduced = reducedMotion();
  delete main.dataset.portraitEgg;
  portrait.setAttribute('aria-pressed', 'false');
  if (reduced) return;
  const { x, y, startRadius, radius } = geometry(portrait);
  // The light pulls back in from the edges; each element returns as it passes.
  const timeAt = (distance: number) =>
    RESTORE * (1 - Math.min(1, Math.max(0, (distance - startRadius) / (radius - startRadius))));
  const animations: Animation[] = targets(x, y).map(({ element, near, far }) =>
    element.animate([{ opacity: 0, offset: 0 }], {
      delay: timeAt(far), duration: Math.max(200, timeAt(near) - timeAt(far)), easing: 'ease-out', fill: 'backwards',
    }));
  const { overlay, rings } = ringOverlay(x, y, radius);
  rings[1].remove();
  animations.push(rings[0].animate([
    { transform: 'scale(1)', opacity: 0 },
    { opacity: 1, offset: .2 },
    { transform: `scale(${startRadius / radius})`, opacity: 0 },
  ], { duration: RESTORE, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' }));
  const run: Run = {
    cancel() {
      animations.forEach((animation) => animation.cancel());
      overlay.remove();
      if (running === run) running = null;
    },
  };
  running = run;
  void Promise.all(animations.map(({ finished }) => finished)).then(() => run.cancel(), () => {});
}

/** The portrait's click handler: burst, or bring the page back once it has burst. */
export function togglePortraitBurst(portrait: HTMLElement) {
  if (scene()?.dataset.portraitEgg !== undefined) restore(portrait);
  else burst(portrait);
}

// The module is also imported while the page is rendered on the server, where there is no document.
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (event) => {
    const portrait = document.querySelector<HTMLElement>('.center-node');
    if (event.key === 'Escape' && portrait && scene()?.dataset.portraitEgg !== undefined) restore(portrait);
  });

  // Leaving the page mid-burst must not leave the shake, ring or hidden page behind.
  document.addEventListener('astro:before-preparation', () => {
    running?.cancel();
    const main = scene();
    if (main) delete main.dataset.portraitEgg;
    document.querySelector('.center-node')?.setAttribute('aria-pressed', 'false');
  });
}
