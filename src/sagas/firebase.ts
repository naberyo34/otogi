import { put, takeLatest, call, fork, all } from 'redux-saga/effects';
import reduxSagaFirebase from 'services/firebase';
import types from 'modules/firebase/actionTypes';
import {
  getCharacters,
  addCharacter,
  updateCharacter,
  UpdateCharacterPayload,
} from 'modules/firebase/actions';
import Action from 'interfaces/action';
import Character from 'interfaces/character';

// Firestoreにpayloadのキャラクター情報を送信する
function* runAddCharacter(action: Action) {
  const character: Character = action.payload;
  try {
    yield call(
      reduxSagaFirebase.firestore.setDocument,
      `characters/${character.name}`,
      character,
      {
        merge: true,
      }
    );
    yield put(addCharacter.succeed());
    alert('データの送信に成功しました!');
  } catch (err) {
    yield put(addCharacter.fail());
    alert('データの送信に失敗しました');
  }
}

// payloadと一致するFirebase上のキャラクター情報を更新する
function* runUpdateCharacter(action: Action) {
  const { target, key, value }: UpdateCharacterPayload = action.payload;
  try {
    yield call(
      reduxSagaFirebase.firestore.updateDocument,
      `characters/${target}`,
      key,
      value
    );
    yield put(updateCharacter.succeed());
  } catch (err) {
    yield put(updateCharacter.fail());
    alert('データの更新に失敗しました');
  }
}

// ADD_CHARACTERアクションが発行されるのを待ち受ける
export function* watchAddCharacter() {
  yield takeLatest(types.ADD_CHARACTER_START, runAddCharacter);
}

// MODIFY_CHARACTERアクションが発行されるのを待ち受ける
export function* watchUpdateCharacter() {
  yield takeLatest(types.UPDATE_CHARACTER_START, runUpdateCharacter);
}

export default function* rootSaga() {
  // 指定したコレクションを監視して同期をとってくれるらしい
  // https://redux-saga-firebase.js.org/reference/dev/firestore#syncCollection
  yield all([
    fork(reduxSagaFirebase.firestore.syncCollection, 'characters', {
      successActionCreator: getCharacters,
    }),
    fork(watchAddCharacter),
    fork(watchUpdateCharacter),
  ]);
}
