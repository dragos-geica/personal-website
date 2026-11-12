// Every motion duration and easing lives here. The same values are exposed to CSS
// as custom properties, so keyframes and scripted motion cannot drift apart.

export const durations = {
  /** Ring sweep that clears the graph away from the opened category. */
  sweep: 700,
  /** Hub travel to its branch position; it starts while the ring is still moving. */
  travel: 520,
  /** A branch line drawing along its length, from the hub to a child. */
  edge: 380,
  /** A child's outline traces in, then its label pops. */
  outline: 150,
  label: 210,
  /** Shortest fade for a graph element the ring passes, so nothing blinks out. */
  sweepFade: 180,
  /** Delay between neighbouring branch children. */
  stagger: 90,
  /** Closing a branch: node fade, edge retract, reverse stagger. */
  closeNode: 140,
  closeEdge: 150,
  closeStagger: 45,
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
/**
 * The ring leaves the clicked node at a moderate speed and decelerates as it widens.
 * (A front-loaded ease-out jumped most of the distance within the first few frames.)
 */
export const sweepCurve = [.3, .12, .25, 1] as const;

export const easings = {
  /** Symmetric movement between two resting positions. */
  move: `cubic-bezier(${moveCurve.join(',')})`,
  /** Decelerating entrances. */
  enter: 'cubic-bezier(.33,1,.68,1)',
  /** The ring sweep. */
  sweep: `cubic-bezier(${sweepCurve.join(',')})`,
  /** Accelerating exits. */
  exit: 'cubic-bezier(.4,0,1,1)',
} as const;

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/** CSS custom properties for every token, e.g. `--motion-sweep: 540ms`. */
export function motionProperties() {
  const properties: Record<string, string> = {};
  for (const [name, value] of Object.entries(durations)) properties[`--motion-${kebab(name)}`] = `${value}ms`;
  for (const [name, value] of Object.entries(easings)) properties[`--ease-${kebab(name)}`] = value;
  properties['--motion-reveal-start'] = `${revealStart()}ms`;
  properties['--motion-children-start'] = `${childrenStart()}ms`;
  return properties;
}

export function applyMotionProperties(root: HTMLElement) {
  for (const [name, value] of Object.entries(motionProperties())) root.style.setProperty(name, value);
}

/** When the branch reveal starts, measured from the moment the hub begins travelling. */
export function revealStart() {
  return Math.round(durations.travel * revealStartFraction);
}

/**
 * The lines to the children set off from the hub once the reveal starts, one stagger apart.
 * The open hub itself takes the place of a Back button: clicking it closes the branch.
 */
export function childrenStart() {
  return revealStart();
}

/** When a child (order 1, 2, …) has fully appeared: its line drawn, outline traced, label in. */
export function branchItemSettled(order: number) {
  return childrenStart() + (order - 1) * durations.stagger + durations.edge + durations.outline / 2 + durations.label;
}

/** Total time from the hub starting to travel until every child is visible. */
export function branchRevealDuration(children: number) {
  return branchItemSettled(children);
}

/** Inverse of a `cubic-bezier()` timing function: the input time at which it outputs `value`. */
export function cubicBezierInverse(x1: number, y1: number, x2: number, y2: number) {
  const axis = (a: number, b: number) => (t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  const x = axis(x1, x2);
  const y = axis(y1, y2);
  return (value: number) => {
    if (value <= 0) return 0;
    if (value >= 1) return 1;
    let low = 0;
    let high = 1;
    for (let step = 0; step < 40; step++) {
      const t = (low + high) / 2;
      if (y(t) < value) low = t;
      else high = t;
    }
    return x((low + high) / 2);
  };
}

const sweepInverse = cubicBezierInverse(...sweepCurve);

/** When does the ring's outer edge, growing along the sweep curve, reach `radius`? */
export function sweepTimeAt(radius: number, startRadius: number, endRadius: number, duration = durations.sweep) {
  if (endRadius <= startRadius) return 0;
  const progress = Math.min(1, Math.max(0, (radius - startRadius) / (endRadius - startRadius)));
  return duration * sweepInverse(progress);
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
