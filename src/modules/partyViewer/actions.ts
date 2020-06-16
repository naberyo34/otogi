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

export const setMyCharacter = (payload: Character): Action => ({
  type: types.SET_MY_CHARACTER,
  payload,
});

export const selectPartyCharacter = (payload: string): Action => ({
  type: types.SELECT_PARTY_CHARACTER,
  payload,
});

export const setPartyCharacters = (payload: Character[]): Action => ({
  type: types.SET_PARTY_CHARACTERS,
  payload,
});
