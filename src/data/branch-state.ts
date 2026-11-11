export type BranchState = { parent: string } | null;

export type BranchAction =
  | { type: 'toggle'; parent: string }
  | { type: 'close' };

export function branchReducer(state: BranchState, action: BranchAction): BranchState {
  switch (action.type) {
    case 'toggle':
      return state?.parent === action.parent ? null : { parent: action.parent };
    case 'close':
      return null;
  }
}
