import types from 'modules/characterMaker/actionTypes';
import Action from 'interfaces/action';
import Character from 'interfaces/character';
import combatSkills from 'services/skills/combatSkills';
import exploreSkills from 'services/skills/exploreSkills';
import behaviorSkills from 'services/skills/behaviorSkills';
import negotiationSkills from 'services/skills/negotiationSkills';
import knowledgeSkills from 'services/skills/knowledgeSkills';

// 初期パラメータとして挿入されるキャラクターのデータ(すべて最低値)
export const initialCharacter: Character = {
  name: '',
  foundationParams: {
    str: 3,
    con: 3,
    pow: 3,
    dex: 3,
    app: 3,
    siz: 8,
    int: 8,
    edu: 6,
  },
  hp: 5,
  mp: 3,
  san: 15,
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
        ...state,
        character: {
          ...state.character,
          ...action.payload,
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
