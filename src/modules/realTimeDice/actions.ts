import types from 'modules/realTimeDice/actionTypes';
import Action from 'interfaces/action';
import { Result, RollingType } from 'interfaces/dice';

export const setDiceCount = (payload: number): Action => ({
  type: types.SET_DICE_COUNT,
  payload,
});

export const setDiceSize = (payload: number): Action => ({
  type: types.SET_DICE_SIZE,
  payload,
});

export const setJudgementNumber = (payload: number): Action => ({
  type: types.SET_JUDGEMENT_NUMBER,
  payload,
});

export const setRollingType = (payload: RollingType): Action => ({
  type: types.SET_ROLLING_TYPE,
  payload,
});

export const setGlobalResult = (payload: Result): Action => ({
  type: types.SET_GLOBAL_RESULT,
  payload,
});

export const setLocalResult = (payload: Result): Action => ({
  type: types.SET_LOCAL_RESULT,
  payload,
});

export const toggleDiceLog = (): Action => ({
  type: types.TOGGLE_DICE_LOG,
});
