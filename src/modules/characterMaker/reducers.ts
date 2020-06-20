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
  makingCharacter: Character;
  editCharacter: string;
}

// stateの初期化
const initialState: CharacterMakerState = {
  makingCharacter: initialCharacter,
  editCharacter: '',
};

// Reducerの定義
const characterMaker = (
  state = initialState,
  action: Action
): CharacterMakerState => {
  switch (action.type) {
    // 名前を入力したとき
    case types.CHANGE_CHARACTER_NAME: {
      return {
        ...state,
        makingCharacter: {
          ...state.makingCharacter,
          name: action.payload,
        },
      };
    }
    // STRなどの値を変更したとき
    case types.CHANGE_CHARACTER_PARAMS: {
      return {
        ...state,
        makingCharacter: {
          ...state.makingCharacter,
          foundationParams: {
            ...state.makingCharacter.foundationParams,
            [action.payload.name]: action.payload.point,
          },
        },
      };
    }
    // 技能欄に入力したとき
    case types.CHANGE_CHARACTER_SKILLS: {
      return {
        ...state,
        makingCharacter: {
          ...state.makingCharacter,
          [action.payload.skillKey]: action.payload.skills,
        },
      };
    }
    // 編集キャラクターの切り替え (空文字は新規作成として判定する)
    case types.CHANGE_EDIT_CHARACTER: {
      return {
        ...state,
        editCharacter: action.payload,
      };
    }
    // makingCharacterを一括で書き換える (既存キャラクターをロードしたときなどに使用)
    case types.SET_CHARACTER_ALL_PARAMS: {
      return {
        ...state,
        makingCharacter: action.payload,
      };
    }
    default:
      return state;
  }
};

export default characterMaker;
