import { Action } from './actions';
import types from './actionTypes';

// stateの型定義
export interface CharacterMakerState {
  str: number;
  con: number;
  pow: number;
  dex: number;
  app: number;
  siz: number;
  int: number;
  edu: number;
}

// stateの初期化
const initialState: CharacterMakerState = {
  str: 3,
  con: 3,
  pow: 3,
  dex: 3,
  app: 3,
  siz: 8,
  int: 8,
  edu: 6,
};

// Reducerの定義
const characterMaker = (
  state = initialState,
  action: Action
): CharacterMakerState => {
  switch (action.type) {
    case types.CHANGE_CHARACTER_PARAMS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export default characterMaker;
