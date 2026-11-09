import type { CSSProperties } from 'react';
import { centerNode, graphCanvas, graphNodes, type GraphNode } from '../data/graph';
import GraphIcon from './GraphIcon';

const { width, height } = graphCanvas;

function coordinates(x: number, y: number): CSSProperties {
  return {
    '--x': `${x / width * 100}%`,
    '--y': `${y / height * 100}%`,
  } as CSSProperties;
}

function CategoryNode({ node }: { node: GraphNode }) {
  const style = {
    ...coordinates(...node.position),
    '--size': `${node.size / width * 100}cqw`,
  } as CSSProperties;
  const name = <><GraphIcon id={node.id} /><span>{node.label}</span></>;
  const description = `relationship-${node.id}`;

  return (
    <li className="category" style={style}>
      <svg className="graph-edges" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <path className="edge-line" d={node.curve} />
        {node.highlights.map(([cx, cy]) => (
          <circle className="edge-glint" key={cx} cx={cx} cy={cy} r="3" />
        ))}
      </svg>
      {node.href
        ? <a className="node category-node" href={node.href} aria-describedby={description}>{name}</a>
        : <div className="node category-node" role="group" tabIndex={0} aria-label={node.label}
            aria-describedby={description}>{name}</div>}
      <span id={description} className="relationship" style={coordinates(...node.pill)}>{node.verb}</span>
    </li>
  );
}

export default function KnowledgeGraph() {
  const { x, y, size, label } = centerNode;

  return (
    <div id="knowledge-graph" className="knowledge-graph" tabIndex={-1} role="group" aria-label="Personal knowledge graph">
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
        {graphNodes.map((node) => <CategoryNode key={node.id} node={node} />)}
      </ul>
    </div>
  );
}
