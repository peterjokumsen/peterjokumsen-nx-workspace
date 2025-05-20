export type AdminActionType = 'out' | 'time-out' | 'time-in' | 'ballgame';

export interface AdminAction {
  type: AdminActionType;
}

export type BattingActionType = 'strike' | 'ball' | 'hit';

export interface BattingAction {
  type: BattingActionType;
}

export type FieldingActionType = 'foul' | 'home-run';

export interface FieldingAction {
  type: FieldingActionType;
}

export type FieldingFielderActionType = 'catch' | 'fielded' | 'error';

export interface FieldingFielderAction {
  type: FieldingFielderActionType;
  fielderId: string;
}

export type GameActionTypes =
  | AdminActionType
  | BattingActionType
  | FieldingActionType
  | FieldingFielderActionType;
export type GameAction =
  | AdminAction
  | BattingAction
  | FieldingAction
  | FieldingFielderAction;
