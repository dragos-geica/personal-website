import type { CSSProperties } from 'react';
import { graphCanvas, type GraphNode } from '../data/graph';

const { width, height } = graphCanvas;
// Coordinates are relative to the primary graph, which reserves room on the open side.
const branchExtension = 300;
const branchLayout = {
  left: { inner: -128, outer: -233 },
  right: { inner: width + 128, outer: width + 233 },
};

export default function GraphBranch({ node, selected, onSelect, onClose }: {
  node: GraphNode;
  selected: string | null;
  onSelect: (child: string) => void;
  onClose: () => void;
}) {
  const [x, y] = node.position;
  const side = x < width / 2 ? 'left' : 'right';
  const { inner, outer } = branchLayout[side];
  const branchStart = side === 'left' ? -branchExtension : 0;
  const fanCenter = Math.max(246, Math.min(height - 238, y));
  const children = node.children.map((label, index) => {
    const cx = index === 0 || index === node.children.length - 1 ? inner : outer;
    const cy = fanCenter + (index - (node.children.length - 1) / 2) * 111;
    return { label, index, cx, cy };
  });

  return (
    <li id={`branch-${node.id}`} className="graph-branch" data-side={side}>
      <div className="branch-actions">
        <button type="button" className="branch-close" onClick={onClose}>Close <span aria-hidden="true">×</span></button>
        <p className="branch-selection" role="status">
          {selected ? <>Selected: <strong>{selected}</strong></> : <>Choose a {node.label} item</>}
        </p>
      </div>
      <svg className="branch-edges" viewBox={`${branchStart} 0 ${width + branchExtension} ${height}`}
        style={{ left: `${branchStart / width * 100}%`, width: `${(width + branchExtension) / width * 100}%` }}
        preserveAspectRatio="none" aria-hidden="true">
        {children.map(({ label, cx, cy }) => (
          <path key={label} className="branch-edge"
            d={`M ${x} ${y} C ${x + (cx - x) * .55} ${y}, ${x + (cx - x) * .5} ${cy}, ${cx} ${cy}`} />
        ))}
      </svg>
      <ul className="branch-children" role="list" aria-label={`${node.label} items`}>
        {children.map(({ label, index, cx, cy }) => (
          <li key={label} style={{ '--x': `${cx / width * 100}%`, '--y': `${cy / height * 100}%`,
            '--order': index } as CSSProperties}>
            <button type="button" className="node child-node" aria-pressed={selected === label}
              onClick={() => onSelect(label)}>{label}</button>
          </li>
        ))}
      </ul>
    </li>
  );
}
