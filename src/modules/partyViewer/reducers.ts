import types from 'modules/partyViewer/actionTypes';
import Action from 'interfaces/action';
import { SkillType } from 'interfaces/skill';

export interface PartyViewerState {
  myCharacter: string;
  partyCharacters: string[];
  selectedCharacter: string;
  selectedSkillView: SkillType;
}

// stateの初期化
const initialState: PartyViewerState = {
  myCharacter: '',
  partyCharacters: [],
  selectedCharacter: '',
  selectedSkillView: 'combat',
};

// Reducerの定義
const partyViewer = (
  state = initialState,
  action: Action
): PartyViewerState => {
  switch (action.type) {
    case types.SET_MY_CHARACTER: {
      return {
        ...state,
        myCharacter: action.payload,
      };
    }
    case types.SET_PARTY_CHARACTERS: {
      return {
        ...state,
        partyCharacters: action.payload,
      };
    }
    case types.CHANGE_PARTY_CHARACTER: {
      return {
        ...state,
        selectedCharacter: action.payload,
      };
    }
    case types.CHANGE_SKILL_VIEW: {
      return {
        ...state,
        selectedSkillView: action.payload,
      };
    }
    default:
      return state;
  }
};

export default partyViewer;
