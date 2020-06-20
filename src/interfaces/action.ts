// MEMO: FSA準拠の書き方
export default interface Action {
  type: string;
  payload?: any;
  error?: boolean;
}

export interface SagaAction {
  start: (payload?: any) => Action;
  succeed: (payload?: any) => Action;
  fail: (payload?: any) => Action;
}
