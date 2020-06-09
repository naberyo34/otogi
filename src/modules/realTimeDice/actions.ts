import types from './actionTypes';

// MEMO: FSA準拠の書き方
export interface Action {
  type: string;
  payload?: any;
  error?: boolean;
}

const toggleLog = (): Action => ({
  type: types.TOGGLE_LOG,
});

export default toggleLog; // Actionが2つになったらデフォルトエクスポートやめます
