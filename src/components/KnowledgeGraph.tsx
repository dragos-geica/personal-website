import { Fragment, useReducer, type CSSProperties } from 'react';
import { branchReducer } from '../data/branch-state';
import GraphBranch from './GraphBranch';
import { centerNode, graphCanvas, graphNodes, type GraphNode } from '../data/graph';
import GraphIcon from './GraphIcon';

const { width, height } = graphCanvas;

function coordinates(x: number, y: number): CSSProperties {
  return {
    '--x': `${x / width * 100}%`,
    '--y': `${y / height * 100}%`,
  } as CSSProperties;
}

const sparks = [[0, -1], [.8, -.6], [1, .1], [.58, .8], [-.42, .9], [-1, .18], [-.75, -.7]];

function CategoryNode({ node, index, open, onToggle }: {
  node: GraphNode; index: number; open: boolean; onToggle: () => void;
}) {
  const style = {
    ...coordinates(...node.position),
    '--size': `${node.size / width * 100}cqw`,
    '--pulse-cycle': `${3.8 + (index % 4) * .55}s`,
    '--pulse-delay': `${index * .41}s`,
  } as CSSProperties;

  return (
    <li className="category" style={style}>
      <svg className="graph-edges" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <path className="edge-line" d={node.curve} />
        <path className="edge-spark" d={node.curve} pathLength="100" />
        {open && <path className="edge-spark activation-spark" d={node.curve} pathLength="100" />}
      </svg>
      <button id={`category-${node.id}`} className="node category-node" type="button" onClick={onToggle}
        aria-expanded={open} aria-controls={open ? `branch-${node.id}` : undefined}
        aria-describedby={`relationship-${node.id}`}>
        <GraphIcon id={node.id} /><span>{node.label}</span>
      </button>
      {open && (
        <span className="node-burst" aria-hidden="true">
          {sparks.map(([dx, dy], index) => <i key={index} style={{
            '--dx': `${dx * 86}px`, '--dy': `${dy * 86}px`,
          } as CSSProperties} />)}
        </span>
      )}
      <span id={`relationship-${node.id}`} className="relationship" style={coordinates(...node.pill)}>{node.verb}</span>
    </li>
  );
}

export default function KnowledgeGraph() {
  const { x, y, size, label } = centerNode;
  const [branch, dispatch] = useReducer(branchReducer, null);
  const active = graphNodes.find((node) => node.id === branch?.parent);
  const activeIndex = graphNodes.findIndex((node) => node.id === branch?.parent);
  // On mobile the branch takes a full grid row immediately after its parent’s row.
  const branchAfter = activeIndex + (1 - activeIndex % 2);

  function closeBranch() {
    if (!branch) return;
    document.getElementById(`category-${branch.parent}`)?.focus();
    dispatch({ type: 'close' });
  }

  return (
    <div id="knowledge-graph" className="knowledge-graph" tabIndex={-1} role="group" aria-label="Personal knowledge graph"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && branch) {
          event.preventDefault();
          closeBranch();
        }
      }}>
      <div className="graph-primary" data-branch-side={active ? active.position[0] < width / 2 ? 'left' : 'right' : undefined}>
        <div className="center-orbit" style={{
          ...coordinates(x, y),
          '--size': `${size / width * 100}cqw`,
        } as CSSProperties}>
          <span className="orbit orbit-inner" aria-hidden="true" />
          <span className="orbit orbit-dotted" aria-hidden="true" />
          <span className="orbit orbit-outer" aria-hidden="true" />
          <a className="node center-node" href="/about/" aria-labelledby="center-label" aria-describedby="portrait-label">
            <svg className="portrait-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <rect x="9" y="7" width="46" height="50" rx="8" strokeDasharray="3 4" />
              <circle cx="32" cy="25" r="8" />
              <path d="M17 48c1-8 7-12 15-12s14 4 15 12" />
            </svg>
            <span id="center-label" className="center-label">{label}</span>
            <span id="portrait-label" className="portrait-label">Portrait placeholder</span>
          </a>
        </div>

        <ul className="graph-categories" role="list" aria-label="Knowledge categories">
          {graphNodes.map((node, index) => (
            <Fragment key={node.id}>
              <CategoryNode node={node} index={index} open={node.id === active?.id}
                onToggle={() => dispatch({ type: 'toggle', parent: node.id })} />
              {active && branch && index === branchAfter && (
                <GraphBranch key={active.id} node={active} selected={branch.selected} onClose={closeBranch}
                  onSelect={(child) => dispatch({ type: 'select', parent: active.id, child })} />
              )}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}
