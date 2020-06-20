import types from 'modules/firebase/actionTypes';
import Action, { SagaAction } from 'interfaces/action';
import Character from 'interfaces/character';

export interface UpdateCharacterPayload {
  target: string;
  key: string;
  value: any;
}

// rootSagaがFirestoreの変更を検知すると自動で発行されるaction
// payloadには取得してきたFirestoreの情報が格納される
// TODO: 型解決がうまくいかないのでpayloadをanyにしてます
export const getCharacters = (payload: any): Action => ({
  type: types.GET_CHARACTERS,
  payload,
});

// characterMakerで新規キャラクターの作成ボタンを押したときに発行
// 入力したキャラクター情報をpayloadとして、Saga側でFirestoreへの追加処理を行う
export const addCharacter: SagaAction = {
  start: (payload: Character) => ({
    type: types.ADD_CHARACTER_START,
    payload,
  }),
  succeed: () => ({
    type: types.ADD_CHARACTER_SUCCEED,
  }),
  fail: () => ({
    type: types.ADD_CHARACTER_FAIL,
  }),
};

// キャラクターを編集、partyViewerで値を変更したときなど汎用的に使えるキャラクター更新処理
export const updateCharacter: SagaAction = {
  start: (payload: UpdateCharacterPayload) => ({
    type: types.UPDATE_CHARACTER_START,
    payload,
  }),
  succeed: () => ({
    type: types.UPDATE_CHARACTER_SUCCEED,
  }),
  fail: () => ({
    type: types.UPDATE_CHARACTER_FAIL,
  }),
};
