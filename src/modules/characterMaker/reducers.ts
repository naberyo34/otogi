import { Action } from './actions';
import types from './actionTypes';
import combatSkills, { Skill } from '../../services/skills/combatSkills';
import exploreSkills from '../../services/skills/exploreSkills';
import behaviorSkills from '../../services/skills/behaviorSkills';
import negotiationSkills from '../../services/skills/negotiationSkills';
import knowledgeSkills from '../../services/skills/knowledgeSkills';

interface VariableParams {
  max: number;
  current: number;
}

interface San extends VariableParams {
  madness: number;
}

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
  hp: VariableParams;
  mp: VariableParams;
  san: San;
  combatSkills: Skill[];
  exploreSkills: Skill[];
  behaviorSkills: Skill[];
  negotiationSkills: Skill[];
  knowledgeSkills: Skill[];
  [key: string]: any; // 仕方なかった
}

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
  combatSkills,
  exploreSkills,
  behaviorSkills,
  negotiationSkills,
  knowledgeSkills,
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
    case types.SET_CHARACTER_SKILLS: {
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
