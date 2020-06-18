import types from './actionTypes';
import { Skill } from '../../services/skills/combatSkills';

// TODO: 依存関係が相互になってしまうので一時的にここにも書いてる
// 型定義を別ファイルで切り出したほうがいいと想います

interface Name {
  name: string;
}

export interface FoundationParams {
  str: number;
  con: number;
  pow: number;
  dex: number;
  app: number;
  siz: number;
  int: number;
  edu: number;
}

// MEMO: FSA準拠の書き方
export interface Action {
  type: string;
  payload?: any;
  error?: boolean;
}

export const setCharacterName = (payload: Name): Action => ({
  type: types.SET_CHARACTER_NAME,
  payload,
});

export const setCharacterParams = (payload: FoundationParams): Action => ({
  type: types.SET_CHARACTER_PARAMS,
  payload,
});

export const setCharacterSkills = (payload: Skill[]): Action => ({
  type: types.SET_CHARACTER_SKILLS,
  payload,
});
