import type { CSSProperties } from 'react';
import { graphCanvas, type GraphNode } from '../data/graph';
import { nodeDestination } from '../data/node-destinations';
import { useEffect, useLayoutEffect, useRef, useState, type AnimationEvent } from 'react';
import { PROJECT_HUB_X } from '../scripts/branch-motion';
import NodeOutline from './NodeOutline';
import { constellation } from '../data/branch-layout';

const { width, height } = graphCanvas;
// Coordinates are relative to the primary graph, which reserves room on the open side.
const branchExtension = 300;
// Node centres stay this far inside the graph so a full circle always fits.
const edgeMargin = 85;

export default function GraphBranch({ node, selected, onSelect, onClose, revealBranch, onRevealComplete }: {
  node: GraphNode;
  selected: string | null;
  onSelect: (child: string) => void;
  onClose: () => void;
  revealBranch: boolean;
  onRevealComplete: () => void;
}) {
  const [preview, setPreview] = useState(Boolean(selected));
  // The hub lands where the cursor was, so a child can appear under a resting pointer.
  // Hover styling waits for the reveal to finish and the pointer to move.
  const [hoverLocked, setHoverLocked] = useState(revealBranch);
  const mobileEdges = useRef<SVGSVGElement>(null);
  const desktopEdges = useRef<SVGSVGElement>(null);
  const isProjects = node.id === 'projects';
  const [originalX] = node.position;
  const x = isProjects ? PROJECT_HUB_X : originalX < width / 2 ? 460 : 620;
  const y = height / 2;
  const side = originalX < width / 2 ? 'left' : 'right';
  const backX = x + (side === 'left' ? 225 : -225);
  const branchStart = side === 'left' ? -branchExtension : 0;
  // The branch actions sit in the top corner on the open side; children keep clear of them.
  const area = side === 'left'
    ? { left: -branchExtension + edgeMargin, right: x - 200, top: 80, bottom: height - 80,
        keepClear: { left: -Infinity, right: 60, top: -Infinity, bottom: 150 } }
    : { left: x + 200, right: width + branchExtension - edgeMargin, top: 80, bottom: height - 80,
        keepClear: { left: width - 40, right: Infinity, top: -Infinity, bottom: 150 } };
  const children = constellation(node.id, node.children.length, { x, y }, side, area)
    .map(({ x: cx, y: cy }, index) => ({ label: node.children[index], index, cx, cy }));

  useLayoutEffect(() => {
    const hub = document.getElementById(`category-${node.id}`);
    const branch = mobileEdges.current?.closest('.graph-branch');
    const category = hub?.parentElement;
    const desktop = desktopEdges.current;
    const mobile = mobileEdges.current;
    if (!hub || !branch || !category || !desktop || !mobile) return;

    function positionEdges() {
      if (!hub || !branch || !category || !desktop || !mobile) return;
      const bounds = branch.getBoundingClientRect();
      if (!bounds.width) return;
      const buttons = [...branch.querySelectorAll<HTMLElement>('.child-node')];
      function updatePaths(svg: SVGSVGElement, curves: string[]) {
        svg.querySelectorAll('path').forEach((path, index) => {
          if (path.getAttribute('d') !== curves[index]) path.setAttribute('d', curves[index]);
        });
      }
      if (getComputedStyle(desktop).display !== 'none') {
        // Canvas units are not square on screen, so aim and trim each edge in pixels.
        // Positions come from the layout, not from measuring the hub, which may be
        // mid-travel when this runs.
        const scaleX = bounds.width / width;
        const scaleY = bounds.height / height;
        const hubRadius = hub.offsetWidth / 2;
        const curves = buttons.map((button, index) => {
          const target = index === 0 ? { cx: backX, cy: y } : children[index - 1];
          const radius = button.offsetWidth / 2;
          const dx = (target.cx - x) * scaleX;
          const dy = (target.cy - y) * scaleY;
          const length = Math.hypot(dx, dy) || 1;
          const [ux, uy] = [dx / length, dy / length];
          const start = [x + ux * hubRadius / scaleX, y + uy * hubRadius / scaleY];
          const end = [target.cx - ux * radius / scaleX, target.cy - uy * radius / scaleY];
          const point = ([px, py]: number[]) => `${px.toFixed(1)} ${py.toFixed(1)}`;
          if (index === 0) return `M ${point(start)} L ${point(end)}`;
          // A slight alternating bow keeps the constellation organic rather than spoked.
          const bow = (index % 2 ? 1 : -1) * Math.min(36, length * .07);
          const middle = [(start[0] + end[0]) / 2 - uy * bow / scaleX, (start[1] + end[1]) / 2 + ux * bow / scaleY];
          return `M ${point(start)} Q ${point(middle)} ${point(end)}`;
        });
        updatePaths(desktop, curves);
        return;
      }

      // A spine runs straight down from the hub through the gap between the two
      // columns; each child branches off it with a short bend into its inner side.
      const source = category.getBoundingClientRect();
      const startX = source.left + source.width / 2 - bounds.left;
      const startY = source.top + hub.offsetHeight / 2 - bounds.top;
      const curves = buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 - bounds.left;
        const top = rect.top - bounds.top;
        if (Math.abs(centerX - startX) < rect.width / 4) return `M ${startX} ${startY} V ${top}`;
        const toward = centerX < startX ? -1 : 1;
        const innerX = centerX - toward * rect.width / 2;
        const centerY = top + rect.height / 2;
        const bend = Math.max(0, Math.min(12, Math.abs(innerX - startX) / 2));
        return `M ${startX} ${startY} V ${centerY - bend} Q ${startX} ${centerY} ${startX + toward * bend} ${centerY} H ${innerX}`;
      });
      updatePaths(mobile, curves);
    }

    positionEdges();
    const observer = new ResizeObserver(positionEdges);
    observer.observe(branch);
    observer.observe(hub);
    return () => observer.disconnect();
  }, [node.id, preview]);

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

  const direction = side === 'left' ? -1 : 1;
  const hubRadius = node.size * .87 / .78 / 2;

  return (
    <li id={`branch-${node.id}`} className="graph-branch" data-side={side}
      data-branch-reveal={revealBranch || undefined} data-hover-locked={hoverLocked || undefined}
      onAnimationEnd={onRevealEvent}>
      <div className="branch-actions">
        <button type="button" className="branch-close branch-preview-toggle" aria-pressed={preview}
          onClick={() => setPreview(!preview)}>Preview mode</button>
        <p className="branch-selection" role="status">
          {selected ? <>Selected: <strong>{selected}</strong></> : preview ? 'Select a node to preview it' : <>Choose a {node.label} item</>}
        </p>
      </div>
      <svg className="branch-edges" ref={desktopEdges} viewBox={`${branchStart} 0 ${width + branchExtension} ${height}`}
        style={{ left: `${branchStart / width * 100}%`, width: `${(width + branchExtension) / width * 100}%` }}
        preserveAspectRatio="none" aria-hidden="true">
        <path className="branch-edge branch-back-edge" pathLength={1} style={{ '--order': 0 } as CSSProperties}
          d={`M ${x - direction * hubRadius} ${y} H ${backX + direction * 46}`} />
        {/* Placeholder geometry; the layout effect trims these to the circles before paint. */}
        {children.map(({ label, index, cx, cy }) => (
          <path key={label} className="branch-edge" pathLength={1}
            style={{ '--order': index + 1 } as CSSProperties} d={`M ${x} ${y} L ${cx} ${cy}`} />
        ))}
      </svg>
      <svg className="branch-mobile-edges" ref={mobileEdges} aria-hidden="true">
        <path className="branch-edge branch-back-edge" pathLength={1} style={{ '--order': 0 } as CSSProperties} />
        {children.map(({ label, index }) => (
          <path key={label} className="branch-edge" pathLength={1} style={{ '--order': index + 1 } as CSSProperties} />
        ))}
      </svg>
      <ul className="branch-children" role="list" aria-label={`${node.label} items`}>
        <li className="branch-back" style={{ '--x': `${backX / width * 100}%`, '--y': '50%', '--order': 0 } as CSSProperties}>
          <NodeOutline />
          <button type="button" className="node child-node branch-back-node" onClick={onClose}>
            <span className="branch-label">
              {side === 'right' && <span aria-hidden="true">← </span>}
              Back
              {side === 'left' && <span aria-hidden="true"> →</span>}
            </span>
          </button>
        </li>
        {children.map(({ label, index, cx, cy }) => (
          <li key={label} style={{ '--x': `${cx / width * 100}%`, '--y': `${cy / height * 100}%`,
            '--order': index + 1 } as CSSProperties}>
            <NodeOutline />
            {preview
              ? <button type="button" className="node child-node" aria-pressed={selected === label} data-morph-node={nodeDestination(node.id, label)}
                  onClick={() => onSelect(label)}><span className="branch-label">{label}</span></button>
              : <a className="node child-node" data-selected={selected === label} data-morph-node={nodeDestination(node.id, label)}
                  href={nodeDestination(node.id, label)}>
                  <span className="branch-label">{label}</span>
                </a>}
          </li>
        ))}
      </ul>
    </li>
  );
}
