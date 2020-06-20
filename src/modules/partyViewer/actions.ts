import types from 'modules/partyViewer/actionTypes';
import Action from 'interfaces/action';

export const setMyCharacter = (payload: string): Action => ({
  type: types.SET_MY_CHARACTER,
  payload,
});

export const setPartyCharacters = (payload: string[]): Action => ({
  type: types.SET_PARTY_CHARACTERS,
  payload,
});

export const changePartyCharacter = (payload: string): Action => ({
  type: types.CHANGE_PARTY_CHARACTER,
  payload,
});

export const changeSkillView = (payload: string): Action => ({
  type: types.CHANGE_SKILL_VIEW,
  payload,
});
