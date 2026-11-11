// Every motion duration and easing lives here. The same values are exposed to CSS
// as custom properties, so keyframes and scripted motion cannot drift apart.

export const durations = {
  /** Ring sweep that clears the graph away from the opened category. */
  sweep: 380,
  /** Hub travel to its branch position; it starts while the ring is still moving. */
  travel: 440,
  /** Each branch edge is drawn from the hub before its node appears. */
  edge: 160,
  /** A child's outline traces in, then its label pops. */
  outline: 110,
  label: 140,
  /** Delay between neighbouring branch children. */
  stagger: 60,
  /** Closing a branch: node fade, edge retract, reverse stagger. */
  closeNode: 140,
  closeEdge: 150,
  closeStagger: 45,
  /** Preview panel enter and exit. */
  panel: 250,
  /** Node → page title morph. */
  morphLeave: 300,
  morphTravel: 640,
  morphReturnLeave: 200,
  morphReturnTravel: 580,
  /** Destination content fades in while the title is still settling. */
  content: 320,
  contentStagger: 40,
} as const;

/** Fraction of the hub travel after which branch edges start drawing. */
export const revealStartFraction = .5;
/** Fraction of the title morph after which the destination content starts fading in. */
export const contentStartFraction = .6;

/** Control points of the movement curve, shared by CSS and scripted scrolling. */
export const moveCurve = [.45, 0, .22, 1] as const;

export const easings = {
  /** Symmetric movement between two resting positions. */
  move: `cubic-bezier(${moveCurve.join(',')})`,
  /** Decelerating entrances; also the ring sweep (an ease-out cubic). */
  enter: 'cubic-bezier(.33,1,.68,1)',
  /** Accelerating exits. */
  exit: 'cubic-bezier(.4,0,1,1)',
} as const;

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/** CSS custom properties for every token, e.g. `--motion-sweep: 380ms`. */
export function motionProperties() {
  const properties: Record<string, string> = {};
  for (const [name, value] of Object.entries(durations)) properties[`--motion-${kebab(name)}`] = `${value}ms`;
  for (const [name, value] of Object.entries(easings)) properties[`--ease-${kebab(name)}`] = value;
  properties['--motion-reveal-start'] = `${Math.round(durations.travel * revealStartFraction)}ms`;
  return properties;
}

export function applyMotionProperties(root: HTMLElement) {
  for (const [name, value] of Object.entries(motionProperties())) root.style.setProperty(name, value);
}

/** Time after `revealStart` at which the branch item with this order has fully appeared. */
export function branchItemSettled(order: number) {
  return order * durations.stagger + durations.edge + durations.outline / 2 + durations.label;
}

/** Total time from the hub landing in the branch until every child is visible. */
export function branchRevealDuration(children: number) {
  return Math.round(durations.travel * revealStartFraction) + branchItemSettled(children);
}

/** Inverse of the ring's ease-out cubic: when does the ring's outer edge reach `radius`? */
export function sweepTimeAt(radius: number, startRadius: number, endRadius: number, duration = durations.sweep) {
  if (endRadius <= startRadius) return 0;
  const progress = Math.min(1, Math.max(0, (radius - startRadius) / (endRadius - startRadius)));
  return duration * (1 - Math.cbrt(1 - progress));
}

/** A CSS `cubic-bezier()` timing function evaluated in script (Newton steps, then bisection). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const axis = (a: number, b: number) => (t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  const x = axis(x1, x2);
  const y = axis(y1, y2);
  const slope = (t: number) => 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
  return (progress: number) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    let t = progress;
    for (let step = 0; step < 6; step++) {
      const error = x(t) - progress;
      const derivative = slope(t);
      if (Math.abs(error) < 1e-6) return y(t);
      if (Math.abs(derivative) < 1e-6) break;
      t -= error / derivative;
    }
    let low = 0;
    let high = 1;
    t = progress;
    for (let step = 0; step < 30 && high - low > 1e-6; step++) {
      if (x(t) < progress) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return y(t);
  };
}

export interface ViewportSize { width: number; height: number }

/**
 * Mobile browsers resize the viewport whenever their toolbars slide in or out.
 * Only a width change, or a height change larger than browser chrome, moves the layout.
 */
export function isLayoutResize(from: ViewportSize, to: ViewportSize, heightThreshold = 160) {
  return Math.abs(to.width - from.width) >= 1 || Math.abs(to.height - from.height) > heightThreshold;
}

/** Calls `onResize` only for resizes that change the layout, per `isLayoutResize`. */
export function onLayoutResize(onResize: () => void) {
  let size = { width: innerWidth, height: innerHeight };
  const listener = () => {
    const next = { width: innerWidth, height: innerHeight };
    if (!isLayoutResize(size, next)) return;
    size = next;
    onResize();
  };
  window.addEventListener('resize', listener);
  return () => window.removeEventListener('resize', listener);
}
