// Places an open category's children like a small constellation around its hub:
// scattered in angle and distance, the same every time for a given category,
// and never closer to each other than a minimum spacing.

export interface Point { x: number; y: number }

export interface ConstellationArea {
  /** Allowed rectangle for node centres, in canvas units. */
  left: number;
  right: number;
  top: number;
  bottom: number;
  /** A corner kept clear for the branch actions (Preview mode). */
  keepClear?: { left: number; right: number; top: number; bottom: number };
}

/**
 * Canvas units are not square on screen: the graph is wider in units than in pixels.
 * One vertical unit is roughly this many horizontal units, so distances are measured
 * in horizontal units after scaling y by it.
 */
export const CANVAS_ASPECT = 1.35;
/** Minimum centre-to-centre distance between children, in horizontal canvas units. */
export const CHILD_SPACING = 235;
/** Minimum distance between a child's centre and the hub's centre. */
export const HUB_CLEARANCE = 290;

function seeded(text: string) {
  let state = 2166136261;
  for (const character of text) state = Math.imul(state ^ character.charCodeAt(0), 16777619);
  return () => {
    state = Math.imul(state ^ (state >>> 15), 2246822507);
    state = Math.imul(state ^ (state >>> 13), 3266489909);
    state ^= state >>> 16;
    return (state >>> 0) / 4294967296;
  };
}

export function constellation(seed: string, count: number, hub: Point, side: 'left' | 'right', area: ConstellationArea): Point[] {
  const random = seeded(seed);
  const outward = side === 'left' ? -1 : 1;
  const k = CANVAS_ASPECT;
  // Work in a square space: u is horizontal units, v is vertical units scaled by k.
  const bounds = { left: area.left, right: area.right, top: area.top * k, bottom: area.bottom * k };
  const clear = area.keepClear && {
    left: area.keepClear.left, right: area.keepClear.right, top: area.keepClear.top * k, bottom: area.keepClear.bottom * k,
  };
  const reach = Math.max(area.right - hub.x, hub.x - area.left);
  const near = HUB_CLEARANCE + 30;
  const far = Math.max(near + 60, Math.min(reach - 40, near + 330));
  const spread = Math.min(1.2, .4 + count * .2);
  const slot = (2 * spread) / Math.max(1, count);

  const parity = random() < .5 ? 0 : 1;
  const points = Array.from({ length: count }, (_, index) => {
    const angle = (count === 1 ? 0 : -spread + slot * (index + .5)) + (random() - .5) * slot * .55;
    // Alternate inner and outer orbits, each with its own wobble, so no two line up.
    const band = count === 1 ? .3 + random() * .4 : (index + parity) % 2 ? .62 + random() * .38 : random() * .35;
    const radius = near + (far - near) * band;
    return { u: hub.x + outward * radius * Math.cos(angle), v: hub.y * k + radius * Math.sin(angle) };
  });

  const clamp = (point: { u: number; v: number }) => {
    point.u = Math.min(bounds.right, Math.max(bounds.left, point.u));
    point.v = Math.min(bounds.bottom, Math.max(bounds.top, point.v));
    if (clear && point.u > clear.left && point.u < clear.right && point.v > clear.top && point.v < clear.bottom) {
      point.v = clear.bottom;
    }
    // Stay on the open side of the hub.
    if ((point.u - hub.x) * outward < HUB_CLEARANCE * .55) point.u = hub.x + outward * HUB_CLEARANCE * .55;
  };

  // Relax: push apart pairs that are too close, and anything too close to the hub.
  const hubV = hub.y * k;
  for (let step = 0; step < 200; step++) {
    let moved = false;
    for (let a = 0; a < count; a++) {
      for (let b = a + 1; b < count; b++) {
        const p = points[a];
        const q = points[b];
        let du = q.u - p.u;
        let dv = q.v - p.v;
        let distance = Math.hypot(du, dv);
        if (distance >= CHILD_SPACING) continue;
        if (distance < 1e-6) { du = 0; dv = 1; distance = 1; }
        const push = (CHILD_SPACING - distance) / 2 + .5;
        p.u -= du / distance * push; p.v -= dv / distance * push;
        q.u += du / distance * push; q.v += dv / distance * push;
        moved = true;
      }
    }
    for (const point of points) {
      const du = point.u - hub.x;
      const dv = point.v - hubV;
      const distance = Math.hypot(du, dv) || 1;
      if (distance < HUB_CLEARANCE) {
        point.u = hub.x + du / distance * HUB_CLEARANCE;
        point.v = hubV + dv / distance * HUB_CLEARANCE;
        moved = true;
      }
      clamp(point);
    }
    if (!moved) break;
  }
  return points.map(({ u, v }) => ({ x: Math.round(u), y: Math.round(v / k) }));
}
