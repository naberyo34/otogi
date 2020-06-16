import { Action } from './actions';
import types from './actionTypes';
import { Character } from '../characterMaker/reducers';

export interface PartyViewerState {
  characters: Character[];
  myCharacter: Character;
  selectedCharacter: string;
  partyCharacters: Character[];
}

// stateの初期化
const initialState: PartyViewerState = {
  characters: [],
  myCharacter: {
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
  selectedCharacter: '',
  partyCharacters: [],
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
    default:
      return state;
  }
};

export default partyViewer;