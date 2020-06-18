import types from './actionTypes';
import { Skill } from '../../services/skills/combatSkills';

// MEMO: FSA準拠の書き方
export interface Action {
  type: string;
  payload?: any;
  error?: boolean;
}

export const setCharacterName = (payload: string): Action => ({
  type: types.SET_CHARACTER_NAME,
  payload,
});

// ここで渡すpayloadは {str: 18} みたいな形
export const setCharacterParams = (payload: any): Action => ({
  type: types.SET_CHARACTER_PARAMS,
  payload,
});

export const setCharacterSkills = (payload: Skill[]): Action => ({
  type: types.SET_CHARACTER_SKILLS,
  payload,
});
