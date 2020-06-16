import { Action } from './actions';
import types from './actionTypes';

export interface Character {
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

export interface CharacterMakerState {
  character: Character;
}

// stateの初期化
const initialState: CharacterMakerState = {
  character: {
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
  },
};

// Reducerの定義
const characterMaker = (
  state = initialState,
  action: Action
): CharacterMakerState => {
  switch (action.type) {
    // STRなどの値を変更したとき
    case types.SET_CHARACTER_PARAMS: {
      return {
        // character以外のstateは変更しない
        ...state,
        character: {
          // ここで一度元々のcharacterの値を展開し、そこにpayloadの内容を上書きする
          ...state.character,
          ...action.payload,
        },
      };
    }
    // テキストエリアに入力したとき
    case types.SET_CHARACTER_TEXT: {
      return {
        ...state,
        character: {
          ...state.character,
          ...action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export default characterMaker;
