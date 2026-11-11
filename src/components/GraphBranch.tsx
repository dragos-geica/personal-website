import type { CSSProperties } from 'react';
import { graphCanvas, type GraphNode } from '../data/graph';
import { nodeDestination } from '../data/node-destinations';
import { useLayoutEffect, useRef, useState } from 'react';
import { PROJECT_HUB_X } from '../scripts/branch-motion';
import NodeOutline from './NodeOutline';

const { width, height } = graphCanvas;
// Coordinates are relative to the primary graph, which reserves room on the open side.
const branchExtension = 300;
const branchLayout = {
  left: { inner: -45, outer: -150 },
  right: { inner: width + 45, outer: width + 150 },
};

export default function GraphBranch({ node, selected, onSelect, onClose, revealBranch, onRevealComplete }: {
  node: GraphNode;
  selected: string | null;
  onSelect: (child: string) => void;
  onClose: () => void;
  revealBranch: boolean;
  onRevealComplete: () => void;
}) {
  const [preview, setPreview] = useState(Boolean(selected));
  const mobileEdges = useRef<SVGSVGElement>(null);
  const desktopEdges = useRef<SVGSVGElement>(null);
  const isProjects = node.id === 'projects';
  const [originalX] = node.position;
  const x = isProjects ? PROJECT_HUB_X : originalX < width / 2 ? 460 : 620;
  const y = height / 2;
  const side = originalX < width / 2 ? 'left' : 'right';
  const backX = x + (side === 'left' ? 225 : -225);
  const { inner, outer } = branchLayout[side];
  const branchStart = side === 'left' ? -branchExtension : 0;
  const fanCenter = Math.max(246, Math.min(height - 238, y));
  const children = node.children.map((label, index) => {
    const cx = index === 0 || index === node.children.length - 1 ? inner : outer;
    const cy = fanCenter + (index - (node.children.length - 1) / 2) * 111;
    return { label, index, cx, cy };
  });

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
        const unit = width / bounds.width;
        const hubRadius = hub.offsetWidth * unit / 2;
        const direction = side === 'left' ? -1 : 1;
        const curves = buttons.map((button, index) => {
          const radius = button.offsetWidth * unit / 2;
          if (index === 0) {
            return `M ${backX + direction * radius} ${y} H ${x - direction * hubRadius}`;
          } else {
            const target = children[index - 1];
            const startX = x + direction * hubRadius;
            const endX = target.cx - direction * radius;
            return `M ${startX} ${y} C ${startX + (endX - startX) * .55} ${y}, ${startX + (endX - startX) * .5} ${target.cy}, ${endX} ${target.cy}`;
          }
        });
        updatePaths(desktop, curves);
        return;
      }

      const source = category.getBoundingClientRect();
      const startX = source.left + source.width / 2 - bounds.left;
      const startY = source.top + hub.offsetHeight / 2 - bounds.top;
      const curves = buttons.map((button, index) => {
        const rect = button.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2 - bounds.left;
        const targetY = rect.top - bounds.top;
        const midpoint = (startY + targetY) / 2;
        let curve = `M ${startX} ${startY} C ${startX} ${midpoint} ${targetX} ${midpoint} ${targetX} ${targetY}`;
        if (index >= 3) {
          const side = targetX < startX ? -1 : 1;
          const edge = targetX + side * rect.width / 2;
          const bend = edge + side * 16;
          const centerY = targetY + rect.height / 2;
          curve = `M ${startX} ${startY} C ${bend} ${startY} ${bend} ${midpoint} ${bend} ${centerY - 30} Q ${bend} ${centerY} ${edge} ${centerY}`;
        }
        return curve;
      });
      updatePaths(mobile, curves);
    }

    positionEdges();
    const observer = new ResizeObserver(positionEdges);
    observer.observe(branch);
    observer.observe(hub);
    return () => observer.disconnect();
  }, [node.id, preview]);

  const direction = side === 'left' ? -1 : 1;
  const hubRadius = node.size * .87 / .78 / 2;

  return (
    <li id={`branch-${node.id}`} className="graph-branch" data-side={side}
      data-branch-reveal={revealBranch || undefined}
      style={{ '--branch-node-count': node.children.length + 1 } as CSSProperties}
      onAnimationEnd={(event) => {
        if (revealBranch && event.animationName === 'branch-draw'
          && (event.target as Element).classList.contains('branch-back-edge')) onRevealComplete();
      }}>
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
          d={`M ${backX + direction * 46} ${y} H ${x - direction * hubRadius}`} />
        {children.map(({ label, index, cx, cy }) => {
          const startX = x + direction * hubRadius;
          const endX = cx - direction * 70;
          return <path key={label} className="branch-edge" pathLength={1}
            style={{ '--order': index + 1 } as CSSProperties}
            d={`M ${startX} ${y} C ${startX + (endX - startX) * .55} ${y}, ${startX + (endX - startX) * .5} ${cy}, ${endX} ${cy}`} />;
        })}
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
