export type BattingActionType = 'strike' | 'ball';

export interface BattingAction {
  type: BattingActionType;
}

export type GameAction = BattingAction;
