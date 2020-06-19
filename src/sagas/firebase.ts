import { fork } from 'redux-saga/effects';
import reduxSagaFirebase from 'services/firebase';
import getCharacters from 'modules/firebase/actions';

export default function* rootSaga() {
  // 指定したコレクションを監視して同期をとってくれるらしい
  // https://redux-saga-firebase.js.org/reference/dev/firestore#syncCollection
  yield fork(reduxSagaFirebase.firestore.syncCollection, 'characters', {
    successActionCreator: getCharacters,
  });
}
