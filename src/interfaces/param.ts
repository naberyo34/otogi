// データベースに登録する値のみ
export type ParamType =
  | 'str'
  | 'con'
  | 'pow'
  | 'dex'
  | 'app'
  | 'siz'
  | 'int'
  | 'edu';

// HP, MP, SAN, 幸運, アイデア, 知識を含む値
export type AllParamType =
  | 'hp'
  | 'mp'
  | 'san'
  | ParamType
  | 'luck'
  | 'idea'
  | 'know';

export type AllParamLabel =
  | 'HP'
  | 'MP'
  | 'SAN'
  | 'STR'
  | 'CON'
  | 'POW'
  | 'DEX'
  | 'APP'
  | 'SIZ'
  | 'INT'
  | 'EDU'
  | '幸運'
  | 'アイデア'
  | '知識';

export default interface Param {
  name: ParamType;
  point: number;
}

export interface ParamRange {
  name: ParamType;
  min: number;
  max: number;
}

export interface AllParamCategory {
  type: AllParamType;
  label: AllParamLabel;
}

export interface AllParams {
  hp: number;
  maxhp: number;
  mp: number;
  maxmp: number;
  san: number;
  maxsan: number;
  madness: number;
  str: number;
  con: number;
  pow: number;
  dex: number;
  app: number;
  siz: number;
  int: number;
  edu: number;
  luck: number;
  idea: number;
  know: number;
  [key: string]: number;
}
