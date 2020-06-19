import types from 'modules/partyViewer/actionTypes';
import Action from 'interfaces/action';
import Character from 'interfaces/character';

export interface PartyViewerState {
  characters: Character[];
  myCharacterName: string;
  selectedCharacterName: string;
  partyCharacterNames: string[];
  skillTab: string;
}

// stateの初期化
const initialState: PartyViewerState = {
  characters: [],
  myCharacterName: '',
  selectedCharacterName: '',
  partyCharacterNames: [],
  skillTab: 'combat',
};

// Reducerの定義
const partyViewer = (
  state = initialState,
  action: Action
): PartyViewerState => {
  switch (action.type) {
    case types.SET_MY_CHARACTER_NAME: {
      return {
        ...state,
        myCharacterName: action.payload,
      };
    }
    case types.SELECT_PARTY_CHARACTER_NAME: {
      return {
        ...state,
        selectedCharacterName: action.payload,
      };
    }
    case types.SET_PARTY_CHARACTER_NAMES: {
      return {
        ...state,
        partyCharacterNames: action.payload,
      };
    }
    case types.SELECT_SKILL_TAB: {
      return {
        ...state,
        skillTab: action.payload,
      };
    }
    default:
      return state;
  }
};

export default partyViewer;
