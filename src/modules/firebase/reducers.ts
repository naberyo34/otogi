import types from 'modules/firebase/actionTypes';
import { FirebaseSyncAction } from 'interfaces/action';
import Character from 'interfaces/character';

export interface FirebaseState {
  characters: Character[];
}

const initialState: FirebaseState = {
  characters: [],
};

const firebaseReducer = (
  state = initialState,
  action: FirebaseSyncAction
): FirebaseState => {
  const characters: Character[] = [];
  switch (action.type) {
    case types.GET_CHARACTERS: {
      // payloadとしてquerySnapshotを取得する
      action.payload.forEach((doc) => {
        characters.push(doc.data() as Character);
      });

      return {
        ...state,
        characters,
      };
    }
    default:
      return state;
  }
};

export default firebaseReducer;
