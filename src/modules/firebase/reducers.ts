import firebase from 'firebase';
import types from 'modules/firebase/actionTypes';
import Action from 'interfaces/action';
import Character from 'interfaces/character';

export interface FirebaseState {
  characters: Character[];
  isConnecting: boolean;
  isError: boolean;
}

const initialState: FirebaseState = {
  characters: [],
  isConnecting: false,
  isError: false,
};

const firebaseReducer = (
  state = initialState,
  action: Action
): FirebaseState => {
  const characters: Character[] = [];
  switch (action.type) {
    case types.GET_CHARACTERS: {
      // querySnapshotがpayloadとして送られてくる
      // forEachで配列を作成し、charactersを更新
      action.payload.forEach(
        (doc: firebase.firestore.QueryDocumentSnapshot) => {
          characters.push(doc.data() as Character);
        }
      );

      return {
        ...state,
        characters,
      };
    }
    case types.ADD_CHARACTER_START:
      return {
        ...state,
        isConnecting: true,
      };
    case types.ADD_CHARACTER_SUCCEED:
      return {
        ...state,
        isConnecting: false,
      };
    case types.ADD_CHARACTER_FAIL:
      return {
        ...state,
        isConnecting: false,
        isError: true,
      };
    case types.UPDATE_CHARACTER_START:
      return {
        ...state,
        isConnecting: true,
      };
    case types.UPDATE_CHARACTER_SUCCEED:
      return {
        ...state,
        isConnecting: false,
      };
    case types.UPDATE_CHARACTER_FAIL:
      return {
        ...state,
        isConnecting: false,
        isError: true,
      };
    default:
      return state;
  }
};

export default firebaseReducer;
