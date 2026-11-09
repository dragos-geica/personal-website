export type BranchState = { parent: string; selected: string | null } | null;

export type BranchAction =
  | { type: 'toggle'; parent: string }
  | { type: 'select'; parent: string; child: string }
  | { type: 'close' };

export function branchReducer(state: BranchState, action: BranchAction): BranchState {
  switch (action.type) {
    case 'toggle':
      return state?.parent === action.parent ? null : { parent: action.parent, selected: null };
    case 'select':
      return state?.parent === action.parent ? { ...state, selected: action.child } : state;
    case 'close':
      return null;
  }
}
