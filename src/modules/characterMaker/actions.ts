import types from 'modules/characterMaker/actionTypes';
import Action from 'interfaces/action';

// TODO: ペイロードの形が……
export const setCharacterName = (payload: any): Action => ({
  type: types.SET_CHARACTER_NAME,
  payload,
});

export const setCharacterParams = (payload: any): Action => ({
  type: types.SET_CHARACTER_PARAMS,
  payload,
});

export const setCharacterSkills = (payload: any): Action => ({
  type: types.SET_CHARACTER_SKILLS,
  payload,
});
