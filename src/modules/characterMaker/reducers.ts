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
  luck: number;
  idea: number;
  know: number;
  hp: {
    max: number;
    current: number;
  };
  mp: {
    max: number;
    current: number;
  };
  san: {
    max: number;
    current: number;
    madness: number;
  };
  skill: {
    combat: string;
    explore: string;
    behavior: string;
    negotiation: string;
    knowledge: string;
  };
}

// export interface Status {
//   name: string;
//   value: string;
// }

// 初期パラメータとして挿入されるキャラクターのデータ(すべて最低値)
export const initialCharacter: Character = {
  name: '',
  str: 3,
  con: 3,
  pow: 3,
  dex: 3,
  app: 3,
  siz: 8,
  int: 8,
  edu: 6,
  // POW * 5
  luck: 15,
  // INT * 5
  idea: 40,
  // EDU * 5
  know: 30,
  // CON + SIZ / 2 (切り捨て)
  hp: {
    max: 5,
    current: 5,
  },
  // POW
  mp: {
    max: 3,
    current: 3,
  },
  // POW * 5
  san: {
    max: 15,
    current: 15,
    // max - (max / 5)
    madness: 12,
  },
  skill: {
    combat: '',
    explore: '',
    behavior: '',
    negotiation: '',
    knowledge: '',
  },
};

export interface CharacterMakerState {
  character: Character;
}

// stateの初期化
const initialState: CharacterMakerState = {
  character: initialCharacter,
};

// Reducerの定義
const characterMaker = (
  state = initialState,
  action: Action
): CharacterMakerState => {
  switch (action.type) {
    // 名前を入力したとき
    case types.SET_CHARACTER_NAME: {
      return {
        // character以外のstateは変更しない
        ...state,
        character: {
          // characterも指定要素以外は変更しない
          ...state.character,
          name: action.payload,
        },
      };
    }
    // STRなどの値を変更したとき
    case types.SET_CHARACTER_PARAMS: {
      return {
        ...state,
        character: {
          ...state.character,
          ...action.payload,
        },
      };
    }
    // 技能欄に入力したとき
    case types.SET_CHARACTER_SKILL: {
      return {
        ...state,
        character: {
          ...state.character,
          skill: {
            ...state.character.skill,
            ...action.payload,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default characterMaker;
