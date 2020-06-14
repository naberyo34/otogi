import types from './actionTypes';

// MEMO: FSA準拠の書き方
export interface Action {
  type: string;
  payload?: any;
  error?: boolean;
}

// ここで渡すpayloadは {str: 18} みたいな形
export const editCharacterParams = (payload: any): Action => ({
  type: types.EDIT_CHARACTER_PARAMS,
  payload,
});

export const editCharacterStatus = (payload: string): Action => ({
  type: types.EDIT_CHARACTER_STATUS,
  payload,
});
