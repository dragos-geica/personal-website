import type { BranchState } from './branch-state.ts';
import { graphNodes } from './graph.ts';
import { projects } from './projects.ts';

function childSlug(parent: string, child: string) {
  if (parent === 'projects') {
    return projects.find(({ title }) => title === child)?.slug ?? '';
  }
  return child.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function readBranch(search: string): BranchState {
  const params = new URLSearchParams(search);
  const node = graphNodes.find(({ id }) => id === params.get('branch'));
  if (!node) return null;

  const item = params.get('item');
  const selected = node.children.find((child) => childSlug(node.id, child) === item) ?? null;
  return { parent: node.id, selected };
}

export function branchPath(branch: BranchState) {
  if (!branch) return '/';

  const params = new URLSearchParams({ branch: branch.parent });
  if (branch.selected) params.set('item', childSlug(branch.parent, branch.selected));
  return `/?${params}`;
}
