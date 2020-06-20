import types from 'modules/characterMaker/actionTypes';
import Action from 'interfaces/action';
import Param from 'interfaces/param';
import Skill, { SkillKey } from 'interfaces/skill';
import Character from 'interfaces/character';

interface SkillsPayload {
  skillKey: SkillKey;
  skills: Skill[];
}

export const changeCharacterName = (payload: string): Action => ({
  type: types.CHANGE_CHARACTER_NAME,
  payload,
});

export const changeCharacterParams = (payload: Param): Action => ({
  type: types.CHANGE_CHARACTER_PARAMS,
  payload,
});

export const changeCharacterSkills = (payload: SkillsPayload): Action => ({
  type: types.CHANGE_CHARACTER_SKILLS,
  payload,
});

export const changeEditCharacter = (payload: string): Action => ({
  type: types.CHANGE_EDIT_CHARACTER,
  payload,
});

export const setCharacterAllParams = (payload: Character): Action => ({
  type: types.SET_CHARACTER_ALL_PARAMS,
  payload,
});
