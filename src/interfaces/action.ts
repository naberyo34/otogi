// MEMO: FSA準拠の書き方
export default interface Action {
  type: string;
  payload?: any;
  error?: boolean;
}
