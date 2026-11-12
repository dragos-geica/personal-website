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
  /** An optional rectangle to keep node centres out of. */
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

/** Which way an open category's children spread from its hub. */
export type BranchSide = 'left' | 'right' | 'down';

export function constellation(seed: string, count: number, hub: Point, side: BranchSide, area: ConstellationArea): Point[] {
  const random = seeded(seed);
  // The direction children spread in, and the one they fan out along.
  const [du, dv] = side === 'left' ? [-1, 0] : side === 'right' ? [1, 0] : [0, 1];
  const [pu, pv] = side === 'down' ? [1, 0] : [0, 1];
  const k = CANVAS_ASPECT;
  // Work in a square space: u is horizontal units, v is vertical units scaled by k.
  const bounds = { left: area.left, right: area.right, top: area.top * k, bottom: area.bottom * k };
  const clear = area.keepClear && {
    left: area.keepClear.left, right: area.keepClear.right, top: area.keepClear.top * k, bottom: area.keepClear.bottom * k,
  };
  const reach = side === 'down' ? area.bottom * k - hub.y * k : Math.max(area.right - hub.x, hub.x - area.left);
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
    const [along, across] = [radius * Math.cos(angle), radius * Math.sin(angle)];
    return { u: hub.x + du * along + pu * across, v: hub.y * k + dv * along + pv * across };
  });

  const clamp = (point: { u: number; v: number }) => {
    point.u = Math.min(bounds.right, Math.max(bounds.left, point.u));
    point.v = Math.min(bounds.bottom, Math.max(bounds.top, point.v));
    if (clear && point.u > clear.left && point.u < clear.right && point.v > clear.top && point.v < clear.bottom) {
      point.v = clear.bottom;
    }
    // Stay on the open side of the hub.
    const ahead = (point.u - hub.x) * du + (point.v - hub.y * k) * dv;
    if (ahead < HUB_CLEARANCE * .55) {
      point.u += du * (HUB_CLEARANCE * .55 - ahead);
      point.v += dv * (HUB_CLEARANCE * .55 - ahead);
    }
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
