import types from './actionTypes';

// MEMO: FSA準拠の書き方
export interface Action {
  type: string;
  payload?: any;
  error?: boolean;
}

// ここで渡すpayloadは {str: 18} みたいな形
export const setCharacterParams = (payload: any): Action => ({
  type: types.SET_CHARACTER_PARAMS,
  payload,
});

export const setCharacterText = (payload: any): Action => ({
  type: types.SET_CHARACTER_TEXT,
  payload,
});
