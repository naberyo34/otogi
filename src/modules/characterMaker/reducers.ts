import { Action } from './actions';
import types from './actionTypes';

// stateの型定義
export interface CharacterMakerState {
  name: string;
  str: number;
  con: number;
  pow: number;
  dex: number;
  app: number;
  siz: number;
  int: number;
  edu: number;
  status: string;
}

// stateの初期化
const initialState: CharacterMakerState = {
  name: '',
  str: 3,
  con: 3,
  pow: 3,
  dex: 3,
  app: 3,
  siz: 8,
  int: 8,
  edu: 6,
  status: '',
};

// Reducerの定義
const characterMaker = (
  state = initialState,
  action: Action
): CharacterMakerState => {
  switch (action.type) {
    // STRなどの値を変更したとき
    case types.EDIT_CHARACTER_PARAMS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    // テキストエリアに入力したとき
    case types.EDIT_CHARACTER_TEXT: {
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
