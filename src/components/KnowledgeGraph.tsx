import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { branchReducer, type BranchAction, type BranchState } from '../data/branch-state';
import { navigate } from 'astro:transitions/client';
import { branchPath, readBranch } from '../data/branch-location';
import ContentPanel from './ContentPanel';
import GraphBranch from './GraphBranch';
import { centerNode, graphCanvas, graphNodes, type GraphNode } from '../data/graph';
import GraphIcon from './GraphIcon';
import { moveBranchHub, PROJECT_HUB_X, sweepBranch, type BranchSweep } from '../scripts/branch-motion';
import type { TransitionBeforePreparationEvent } from 'astro:transitions/client';

const { width, height } = graphCanvas;

function coordinates(x: number, y: number): CSSProperties {
  return {
    '--x': `${x / width * 100}%`,
    '--y': `${y / height * 100}%`,
  } as CSSProperties;
}

function CategoryNode({ node, index, open, inactive, onToggle }: {
  node: GraphNode; index: number; open: boolean; inactive: boolean; onToggle: () => void;
}) {
  const style = {
    ...coordinates(...node.position),
    '--size': `${node.size / width * 100}cqw`,
    '--pulse-cycle': `${3.8 + (index % 4) * .55}s`,
    '--pulse-delay': `${index * .41}s`,
  } as CSSProperties;

  return (
    <li className="category" style={style} data-active={open || undefined} data-muted={inactive || undefined} inert={inactive}>
      <svg className="graph-edges" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <path className="edge-line" d={node.curve} />
        <path className="edge-spark" d={node.curve} pathLength="100" />
      </svg>
      <button id={`category-${node.id}`} className="node category-node" type="button" onClick={onToggle}
        data-compact-label={['data-tools', 'interests'].includes(node.id) || undefined}
        aria-expanded={open} aria-controls={open ? `branch-${node.id}` : undefined}
        aria-describedby={`relationship-${node.id}`}>
        <GraphIcon id={node.id} /><span>{node.label}</span>
      </button>
      <span id={`relationship-${node.id}`} className="relationship" style={coordinates(...node.pill)}>{node.verb}</span>
    </li>
  );
}

export default function KnowledgeGraph() {
  const { x, y, size, label } = centerNode;
  const [branch, setBranch] = useState<BranchState>(null);
  const [revealBranch, setRevealBranch] = useState(false);
  const [leavingPanel, setLeavingPanel] = useState<{ parent: string; child: string } | null>(null);
  const graph = useRef<HTMLDivElement>(null);
  const branchSweep = useRef<BranchSweep | null>(null);
  const currentBranch = useRef<BranchState>(null);
  const previewTitle = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<{ id: string; scroll: 'preview' | 'nearest' | 'none' } | null>(null);
  const pendingNavigation = useRef<{ path: string } | null>(null);

  function restoreBranch(next: BranchState) {
    currentBranch.current = next;
    setBranch(next);
  }

  useEffect(() => {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const graphElement = graph.current;
    const observer = new IntersectionObserver(([entry]) => {
      graphElement?.toggleAttribute('data-graph-offscreen', !entry.isIntersecting);
    });
    if (graphElement) observer.observe(graphElement);

    function restoreFromLocation(swap?: Event) {
      const next = readBranch(window.location.search);
      const previous = currentBranch.current;
      if (branchPath(next) === branchPath(previous)) return;
      const parent = next?.parent ?? previous?.parent;
      const animate = Boolean(next && branchSweep.current && !reducedMotion.matches);
      if (parent) pendingFocus.current = {
        id: next?.selected ? 'preview-title' : `category-${parent}`,
        scroll: next?.selected ? 'preview' : swap && !animate ? 'nearest' : 'none',
      };
      setRevealBranch(animate);
      restoreBranch(next);
    }

    function prepareNavigation(raw: Event) {
      const event = raw as TransitionBeforePreparationEvent;
      cancelBranchSweep();
      // Route navigation owns the sweep, including browser Back and Forward.
      // Starting it before navigate() left a window in which history could race it.
      const next = readBranch(event.to.search);
      if (reducedMotion.matches || event.from.pathname !== '/' || event.to.pathname !== '/'
        || readBranch(event.from.search) || !next || !graph.current) return;
      const hub = document.getElementById(`category-${next.parent}`);
      if (!hub) return;
      const sweep = sweepBranch(graph.current, hub);
      branchSweep.current = sweep;
      const cleanup = () => { if (branchSweep.current === sweep) cancelBranchSweep(); };
      event.signal.addEventListener('abort', cleanup, { once: true });
      const load = event.loader;
      event.loader = async () => {
        try {
          // Swap as soon as the ring has cleared the old graph; it fades out over the new layout.
          const [, complete] = await Promise.all([load(), sweep.covered]);
          if (!complete || event.defaultPrevented) cleanup();
        } catch (error) {
          cleanup();
          throw error;
        }
      };
    }

    function onMotionPreferenceChange() {
      if (reducedMotion.matches) {
        cancelBranchSweep();
        setRevealBranch(false);
      }
    }

    restoreFromLocation();
    reducedMotion.addEventListener('change', onMotionPreferenceChange);
    document.addEventListener('astro:after-swap', restoreFromLocation);
    document.addEventListener('astro:before-preparation', prepareNavigation);
    return () => {
      reducedMotion.removeEventListener('change', onMotionPreferenceChange);
      document.removeEventListener('astro:after-swap', restoreFromLocation);
      document.removeEventListener('astro:before-preparation', prepareNavigation);
      cancelBranchSweep();
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    const element = target.id === 'preview-title' ? previewTitle.current : document.getElementById(target.id);
    if (!element) return;
    pendingFocus.current = null;
    if (element.closest('[data-morph-main="arriving"], [data-branch-return]')) return;
    focusTarget(element, target.scroll === 'preview');
    if (target.scroll === 'nearest') element.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [branch]);

  useLayoutEffect(() => {
    if (branch?.parent === readBranch(location.search)?.parent) {
      delete document.documentElement.dataset.graphPending;
      document.querySelector('main')?.removeAttribute('data-graph-pending');
    }
    if (branch && branchSweep.current) {
      const sweep = branchSweep.current;
      branchSweep.current = null;
      sweep.release();
      const { origin } = sweep;
      const hub = document.getElementById(`category-${branch.parent}`);
      if (hub && revealBranch && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        const motion = moveBranchHub(hub, origin);
        return () => motion.cancel();
      }
    }
  }, [branch, revealBranch]);

  function cancelBranchSweep() {
    branchSweep.current?.cleanup();
    branchSweep.current = null;
  }

  function updateBranch(action: BranchAction) {
    const previous = currentBranch.current;
    const next = branchReducer(previous, action);
    if (next === previous) return;
    const path = branchPath(next);
    if (path === branchPath(previous)) {
      if (action.type === 'select' && previewTitle.current) focusTarget(previewTitle.current, true);
      return;
    }
    if (pendingNavigation.current?.path === path) return;
    const request = { path };
    pendingNavigation.current = request;
    void navigate(path).finally(() => {
      if (pendingNavigation.current === request) pendingNavigation.current = null;
    });
  }
  const active = graphNodes.find((node) => node.id === branch?.parent);
  const activeIndex = graphNodes.findIndex((node) => node.id === branch?.parent);
  const shownPanel = active && branch?.selected ? { parent: active.label, child: branch.selected } : null;
  const lastPanel = useRef(shownPanel);
  // Keep a cleared preview mounted for its exit, whether Back, close or history cleared it.
  useLayoutEffect(() => {
    const previous = lastPanel.current;
    lastPanel.current = shownPanel;
    if (shownPanel) setLeavingPanel(null);
    else if (previous && matchMedia('(prefers-reduced-motion: no-preference)').matches) setLeavingPanel(previous);
  }, [shownPanel?.parent, shownPanel?.child]);

  // On mobile the branch takes a full grid row immediately after its parent’s row.
  const branchAfter = activeIndex + (1 - activeIndex % 2);

  function closeBranch() {
    if (!branch) return;
    document.getElementById(`category-${branch.parent}`)?.focus({ preventScroll: true });
    updateBranch({ type: 'close' });
  }

  function returnToChild() {
    const child = document.querySelector<HTMLButtonElement>('.child-node:is([aria-pressed="true"], [data-selected="true"])');
    if (child) focusTarget(child, true);
  }

  return (
    <>
      <div id="knowledge-graph" ref={graph} className="knowledge-graph" tabIndex={-1} role="group" aria-label="Personal knowledge graph"
        onKeyDown={(event) => {
          const opening = !branch && (branchSweep.current || pendingNavigation.current);
          if (event.key === 'Escape' && (branch || opening)) {
            event.preventDefault();
            if (opening) {
              cancelBranchSweep();
              pendingNavigation.current = null;
              const { href } = location;
              const { scrollX: left, scrollY: top } = window;
              // Abort the pending route as well as its visual sweep.
              void navigate(href, { history: 'replace' }).then(() => {
                if (location.href === href && !pendingNavigation.current) window.scrollTo({ left, top, behavior: 'instant' });
              });
            } else closeBranch();
          }
        }}>
        <div className="graph-primary" style={{
          '--projects-hub-x': `${PROJECT_HUB_X / width * 100}%`,
        } as CSSProperties}
          data-branch-parent={branch?.parent} data-branch-reveal={revealBranch || undefined}
          data-branch-side={active ? active.position[0] < width / 2 ? 'left' : 'right' : undefined}>
          <div className="center-orbit" inert={Boolean(active)} style={{
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
                  inactive={Boolean(active && node.id !== active.id)}
                  onToggle={() => updateBranch({ type: 'toggle', parent: node.id })} />
                {active && branch && index === branchAfter && (
                  <GraphBranch key={active.id} node={active} selected={branch.selected} onClose={closeBranch}
                    revealBranch={revealBranch} onRevealComplete={() => setRevealBranch(false)}
                    onSelect={(child) => updateBranch({ type: 'select', parent: active.id, child })} />
                )}
              </Fragment>
            ))}
          </ul>
        </div>
      </div>
      {shownPanel ? (
        <ContentPanel key={shownPanel.child} {...shownPanel} titleRef={previewTitle} onReturn={returnToChild} />
      ) : leavingPanel && (
        <ContentPanel key={`leaving-${leavingPanel.child}`} {...leavingPanel} leaving onReturn={returnToChild}
          onExited={() => setLeavingPanel(null)} />
      )}
    </>
  );
}

function focusTarget(element: HTMLElement, scroll: boolean) {
  element.focus({ preventScroll: true });
  if (scroll) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panel = element.closest('.content-panel');
    (panel ?? element).scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: panel ? 'start' : 'nearest' });
  }
}
