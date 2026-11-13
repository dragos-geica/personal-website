// Places an open category's cards around its hub, in screen pixels. Most cards go on the open
// side in a loose zigzag; with three or more, one or two sit behind the hub when there is room.
// A small seeded jitter keeps it organic, and the same category always gets the same layout.

export interface Point { x: number; y: number }
export interface Box { left: number; right: number; top: number; bottom: number }
export interface Card { x: number; y: number; width: number; height: number }

/** Which way an open category's cards spread from its hub. */
export type BranchSide = 'left' | 'right' | 'down';

/** Space between the hub's rim and the nearest card edge, in pixels. */
export const HUB_GAP = 64;
/** Smallest gap between two cards, in pixels. */
export const CARD_GAP = 18;

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

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

/** Evenly spread `count` centres between `from` and `to` (a single one sits at `middle`). */
function spread(count: number, from: number, to: number, middle: number) {
  if (count === 1) return [clamp(middle, from, to)];
  return Array.from({ length: count }, (_, index) => from + (to - from) * index / (count - 1));
}

/**
 * Card centres for `count` cards of `size` around a hub (centre and radius, in pixels), kept
 * inside `area`. `side` is the direction the branch opens in.
 */
export function cardLayout(seed: string, count: number, hub: Point & { r: number }, side: BranchSide,
  area: Box, size: { width: number; height: number }): Card[] {
  const random = seeded(seed);
  const jitter = (amount: number) => (random() * 2 - 1) * amount;
  const { width: w, height: h } = size;
  const card = (x: number, y: number): Card => ({
    x: Math.round(clamp(x, area.left + w / 2, area.right - w / 2)),
    y: Math.round(clamp(y, area.top + h / 2, area.bottom - h / 2)),
    width: w, height: h,
  });

  if (side === 'down') {
    // One row under the hub when the cards fit side by side, every other card dropped a little.
    // Further rows sit in the gaps of the row above, so their lines pass between its cards.
    const room = area.right - area.left - w;
    const columns = Math.max(1, Math.min(count, Math.floor(room / (w + CARD_GAP * 2)) + 1));
    const rows = Math.ceil(count / columns);
    const top = hub.y + hub.r + HUB_GAP + h / 2;
    const bottom = area.bottom - h / 2;
    const step = columns > 1 ? Math.min(room / (columns - 1), w + 110) : 0;
    const rowStep = rows > 1 ? Math.max(h + CARD_GAP, (bottom - top) / rows) : 0;
    const drop = Math.min(h * .6, Math.max(0, (rows > 1 ? rowStep - h - CARD_GAP : bottom - top) * .8));
    return Array.from({ length: count }, (_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const inRow = Math.min(columns, count - row * columns);
      const offset = row % 2 && inRow === columns ? step / 2 : 0;
      // Centre the row under the hub, shifted sideways if that would run off the window.
      const span = (inRow - 1) * step + offset;
      const middle = clamp(hub.x, area.left + w / 2 + span / 2, area.right - w / 2 - span / 2);
      const x = middle - span / 2 + column * step + offset;
      return card(x + jitter(14), top + row * rowStep + (column % 2) * drop + jitter(8));
    });
  }

  const dir = side === 'right' ? 1 : -1;
  const near = hub.r + HUB_GAP + w / 2;
  const behindRoom = dir > 0 ? hub.x - area.left : area.right - hub.x;
  const back = count >= 3 && behindRoom >= near + w / 2 ? Math.floor(count / 3) : 0;
  const front = count - back;
  const top = area.top + h / 2;
  const bottom = area.bottom - h / 2;

  // Zigzag: alternate cards step further out, so neighbours never line up.
  const step = Math.min(w * .55 + 30, Math.max(0, (dir > 0 ? area.right - hub.x : hub.x - area.left) - near - w / 2));
  const outer = random() < .5 ? 0 : 1;
  const frontYs = spread(front, top, bottom, hub.y - h * .8);
  const cards = frontYs.map((y, index) =>
    card(hub.x + dir * (near + ((index + outer) % 2) * step + jitter(12)), y + jitter(10)));

  // Behind the hub: one card just above its level, or two either side of it.
  const gap = h / 2 + Math.max(CARD_GAP, hub.r * .45);
  const backYs = back === 1 ? [hub.y - h * .7] : [hub.y - gap, hub.y + gap];
  backYs.slice(0, back).forEach((y) => cards.push(card(hub.x - dir * (near + jitter(10)), y + jitter(8))));
  return cards;
}
