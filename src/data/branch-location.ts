import type { BranchState } from './branch-state.ts';
import { graphNodes } from './graph.ts';
import { slugify } from './projects.ts';

export function childSlug(_parent: string, child: string) {
  return slugify(child);
}

export function readBranch(search: string): BranchState {
  const params = new URLSearchParams(search);
  const node = graphNodes.find(({ id }) => id === params.get('branch'));
  return node ? { parent: node.id } : null;
}

export function branchPath(branch: BranchState) {
  return branch ? `/?${new URLSearchParams({ branch: branch.parent })}` : '/';
}
