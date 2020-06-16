import { Action } from './actions';
import types from './actionTypes';
import { Character, initialCharacter } from '../characterMaker/reducers';

export interface PartyViewerState {
  characters: Character[];
  myCharacter: Character;
  selectedCharacter: string;
  partyCharacters: Character[];
  skillTab: string;
}

// stateの初期化
const initialState: PartyViewerState = {
  characters: [],
  myCharacter: initialCharacter,
  selectedCharacter: '',
  partyCharacters: [],
  skillTab: 'combat',
};

// Reducerの定義
const partyViewer = (
  state = initialState,
  action: Action
): PartyViewerState => {
  switch (action.type) {
    // STRなどの値を変更したとき
    case types.GET_CHARACTERS: {
      return {
        ...state,
        characters: action.payload,
      };
    }
    case types.SET_MY_CHARACTER: {
      return {
        ...state,
        myCharacter: action.payload,
      };
    }
    case types.SELECT_PARTY_CHARACTER: {
      return {
        ...state,
        selectedCharacter: action.payload,
      };
    }
    case types.SET_PARTY_CHARACTERS: {
      return {
        ...state,
        partyCharacters: action.payload,
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
