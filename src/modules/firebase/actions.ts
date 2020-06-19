import firebase from 'firebase';
import types from 'modules/firebase/actionTypes';
import Action from 'interfaces/action';

const getCharacters = (payload: any): Action => ({
  type: types.GET_CHARACTERS,
  payload,
});

export default getCharacters;
