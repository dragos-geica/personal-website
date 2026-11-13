import type { CSSProperties } from 'react';
import { branchSide, graphCanvas, type GraphNode } from '../data/graph';
import { nodeDestination } from '../data/node-destinations';
import { useEffect, useLayoutEffect, useRef, useState, type AnimationEvent } from 'react';
import { PROJECT_HUB_X } from '../scripts/branch-motion';
import { cardLayout, type BranchSide, type Card, type Point } from '../data/branch-layout';

const { width, height } = graphCanvas;
/** Where a downward-opening hub sits: top centre (matches its CSS in global.css). */
export const DOWN_HUB = { x: 540, y: 150 };
/** How far each card drifts from its place, in pixels, and how long the drift takes to fade in. */
const DRIFT = 5;
const DRIFT_FADE_IN = 2400;

type Placed = Card & { index: number };

/** A line from the hub's rim to the card's near side, arriving straight on (in pixels). */
function edgePath(hub: Point & { r: number }, card: Placed, side: BranchSide) {
  const point = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const down = side === 'down';
  const end = down ? { x: card.x, y: card.y - card.height / 2 }
    : { x: card.x + (card.x < hub.x ? card.width / 2 : -card.width / 2), y: card.y };
  const dx = end.x - hub.x;
  const dy = end.y - hub.y;
  const length = Math.hypot(dx, dy) || 1;
  const start = { x: hub.x + dx / length * hub.r, y: hub.y + dy / length * hub.r };
  const [sx, sy] = [end.x - start.x, end.y - start.y];
  // Leave the hub along the line's main direction and bend into the card's side.
  const [a, b] = down
    ? [{ x: start.x, y: start.y + sy * .5 }, { x: end.x, y: end.y - sy * .5 }]
    : [{ x: start.x + sx * .1, y: start.y + sy * .75 }, { x: end.x - sx * .5, y: end.y }];
  return `M ${point(start.x, start.y)} C ${point(a.x, a.y)} ${point(b.x, b.y)} ${point(end.x, end.y)}`;
}

export default function GraphBranch({ node, onClose, revealBranch, onRevealComplete }: {
  node: GraphNode;
  onClose: () => void;
  revealBranch: boolean;
  onRevealComplete: () => void;
}) {
  // The hub lands where the cursor was, so a child can appear under a resting pointer.
  // Hover styling waits for the reveal to finish and the pointer to move.
  const [hoverLocked, setHoverLocked] = useState(revealBranch);
  const mobileEdges = useRef<SVGSVGElement>(null);
  const desktopEdges = useRef<SVGSVGElement>(null);
  const side = branchSide(node);
  // The hub's place while open; it must match the open hub's CSS position.
  const [x, y] = side === 'down' ? [DOWN_HUB.x, DOWN_HUB.y]
    : [node.id === 'projects' ? PROJECT_HUB_X : side === 'left' ? 460 : 620, height / 2];
  const children = node.children.map((label, index) => ({ label, blurb: node.blurbs[index], index }));

  useLayoutEffect(() => {
    const hub = document.getElementById(`category-${node.id}`);
    const branch = mobileEdges.current?.closest<HTMLElement>('.graph-branch');
    const category = hub?.parentElement;
    const desktop = desktopEdges.current;
    const mobile = mobileEdges.current;
    if (!hub || !branch || !category || !desktop || !mobile) return;
    const items = [...branch.querySelectorAll<HTMLElement>('.branch-children > li')];
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let placed: Placed[] = [];
    let hubPoint = { x: 0, y: 0, r: 0 };
    const opened = performance.now();

    function updatePaths(svg: SVGSVGElement, curves: string[]) {
      svg.querySelectorAll('path').forEach((path, index) => {
        if (curves[index] && path.getAttribute('d') !== curves[index]) path.setAttribute('d', curves[index]);
      });
    }

    // Each card wanders a few pixels on its own slow loop; its line follows it.
    function drift(now: number) {
      const strength = Math.min(1, (now - opened) / DRIFT_FADE_IN) * DRIFT;
      const moved = placed.map((card) => {
        const phase = card.index * 1.7;
        const dx = Math.sin(now / (5200 + card.index * 610) + phase) * strength;
        const dy = Math.cos(now / (6100 + card.index * 470) + phase * 1.3) * strength * .8;
        items[card.index].style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`;
        return { ...card, x: card.x + dx, y: card.y + dy };
      });
      updatePaths(desktop!, moved.map((card) => edgePath(hubPoint, card, side)));
      frame = requestAnimationFrame(drift);
    }

    function position() {
      if (!hub || !branch || !category || !desktop || !mobile) return;
      cancelAnimationFrame(frame);
      const bounds = branch.getBoundingClientRect();
      if (!bounds.width) return;
      if (getComputedStyle(desktop).display !== 'none') {
        // Positions come from the layout, not from measuring the hub, which may be
        // mid-travel when this runs. Cards may use the whole width of the window.
        hubPoint = { x: x / width * bounds.width, y: y / height * bounds.height, r: hub.offsetWidth / 2 };
        const size = {
          width: Math.max(...items.map((item) => item.offsetWidth)),
          height: Math.max(...items.map((item) => item.offsetHeight)),
        };
        const viewport = document.documentElement.clientWidth;
        const area = { left: 24 - bounds.left, right: viewport - 24 - bounds.left, top: 0, bottom: bounds.height };
        placed = cardLayout(node.id, items.length, hubPoint, side, area, size).map((card, index) => ({
          ...card, index, width: items[index].offsetWidth, height: items[index].offsetHeight,
        }));
        placed.forEach((card) => Object.assign(items[card.index].style, { left: `${card.x}px`, top: `${card.y}px` }));
        updatePaths(desktop, placed.map((card) => edgePath(hubPoint, card, side)));
        if (!still.matches) frame = requestAnimationFrame(drift);
        return;
      }
      items.forEach((item) => {
        item.style.removeProperty('left');
        item.style.removeProperty('top');
        item.style.removeProperty('translate');
      });

      // Phones list the cards one under another. The line drops from the hub, turns into
      // the gutter left of the cards, runs down it and bends into each card's left side.
      const source = category.getBoundingClientRect();
      const startX = source.left + source.width / 2 - bounds.left;
      const startY = source.top + hub.offsetHeight / 2 - bounds.top;
      const first = items[0]?.getBoundingClientRect();
      const cardLeft = (first?.left ?? 0) - bounds.left;
      const gutter = cardLeft - 9;
      const turnY = (first?.top ?? 0) - bounds.top - 14;
      const r = 8;
      const curves = items.map((item) => {
        const rect = item.getBoundingClientRect();
        const centerY = rect.top - bounds.top + rect.height / 2;
        return `M ${startX} ${startY} V ${turnY - r} Q ${startX} ${turnY} ${startX - r} ${turnY} H ${gutter + r} `
          + `Q ${gutter} ${turnY} ${gutter} ${turnY + r} V ${centerY - r} Q ${gutter} ${centerY} ${gutter + r} ${centerY} H ${cardLeft}`;
      });
      updatePaths(mobile, curves);
    }

    position();
    const observer = new ResizeObserver(position);
    observer.observe(branch);
    observer.observe(hub);
    addEventListener('resize', position);
    still.addEventListener('change', position);
    return () => {
      observer.disconnect();
      removeEventListener('resize', position);
      still.removeEventListener('change', position);
      cancelAnimationFrame(frame);
    };
  }, [node.id]);

  useEffect(() => {
    if (revealBranch || !hoverLocked) return;
    const unlock = () => setHoverLocked(false);
    window.addEventListener('pointermove', unlock, { once: true, passive: true });
    return () => window.removeEventListener('pointermove', unlock);
  }, [revealBranch, hoverLocked]);

  function onRevealEvent(event: AnimationEvent) {
    // The last child's label is the final step of the reveal.
    if (revealBranch && event.animationName === 'branch-label-in'
      && (event.target as Element).closest('.branch-children > li:last-child')) onRevealComplete();
  }

  return (
    <li id={`branch-${node.id}`} className="graph-branch" data-side={side}
      data-branch-reveal={revealBranch || undefined} data-hover-locked={hoverLocked || undefined}
      onAnimationEnd={onRevealEvent}>
      <svg className="branch-edges" ref={desktopEdges} aria-hidden="true">
        {/* The layout effect draws these, from the hub to each card, before paint. */}
        {children.map(({ label, index }) => (
          <path key={label} className="branch-edge" pathLength={1} style={{ '--order': index + 1 } as CSSProperties} />
        ))}
      </svg>
      <svg className="branch-mobile-edges" ref={mobileEdges} aria-hidden="true">
        {children.map(({ label, index }) => (
          <path key={label} className="branch-edge" pathLength={1} style={{ '--order': index + 1 } as CSSProperties} />
        ))}
      </svg>
      <ul className="branch-children" role="list" aria-label={`${node.label} items`}>
        {children.map(({ label, blurb, index }) => (
          <li key={label} style={{ '--order': index + 1 } as CSSProperties}>
            <svg className="branch-node-outline" aria-hidden="true">
              <rect x=".75" y=".75" rx="13" pathLength={1} />
            </svg>
            <a className="node child-node" data-morph-node={nodeDestination(node.id, label)} href={nodeDestination(node.id, label)}>
              <span className="branch-label">{label}</span>
              {blurb && <span className="branch-blurb">{blurb}</span>}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}
