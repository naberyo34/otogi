export interface Dice {
  type: string;
  single: number[];
  last: number;
}

export interface HiddenDice {
  type: '何か';
  single: '????';
  last: '????';
}

export interface Result {
  playerName: string;
  dice: Dice | HiddenDice;
  judgement?: string;
  timestamp: string;
}

export type RollingType = 'global' | 'hiding' | 'local' | false;
