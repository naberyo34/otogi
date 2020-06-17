import types from './actionTypes';
import { Character } from '../characterMaker/reducers';

// MEMO: FSA準拠の書き方
export interface Action {
  type: string;
  payload?: any;
  error?: boolean;
}

export const getCharacters = (payload: Character[]): Action => ({
  type: types.GET_CHARACTERS,
  payload,
});

export const setMyCharacterName = (payload: string): Action => ({
  type: types.SET_MY_CHARACTER_NAME,
  payload,
});

export const selectPartyCharacterName = (payload: string): Action => ({
  type: types.SELECT_PARTY_CHARACTER_NAME,
  payload,
});

export const setPartyCharacterNames = (payload: string[]): Action => ({
  type: types.SET_PARTY_CHARACTER_NAMES,
  payload,
});

export const selectSkillTab = (payload: string): Action => ({
  type: types.SELECT_SKILL_TAB,
  payload,
});
