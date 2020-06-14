import types from './actionTypes';

// MEMO: FSA準拠の書き方
export interface Action {
  type: string;
  payload?: any;
  error?: boolean;
}

// ここで渡すpayloadは {str: 18} みたいな形
const changeCharacterParams = (payload: any): Action => ({
  type: types.CHANGE_CHARACTER_PARAMS,
  payload,
});

export default changeCharacterParams; // Actionが2つになったらデフォルトエクスポートやめます
