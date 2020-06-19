import types from 'modules/partyViewer/actionTypes';
import Action from 'interfaces/action';
import Character from 'interfaces/character';

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
