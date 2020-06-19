export type ParamType =
  | 'str'
  | 'con'
  | 'pow'
  | 'dex'
  | 'app'
  | 'siz'
  | 'int'
  | 'edu';

export default interface Param {
  name: ParamType;
  min: number;
  max: number;
}
