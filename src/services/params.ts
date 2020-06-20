import { AllParamCategory, ParamRange } from 'interfaces/param';

export const allParamCategories: AllParamCategory[] = [
  { type: 'hp', label: 'HP' },
  { type: 'mp', label: 'MP' },
  { type: 'san', label: 'SAN' },
  { type: 'str', label: 'STR' },
  { type: 'con', label: 'CON' },
  { type: 'pow', label: 'POW' },
  { type: 'dex', label: 'DEX' },
  { type: 'app', label: 'APP' },
  { type: 'siz', label: 'SIZ' },
  { type: 'int', label: 'INT' },
  { type: 'edu', label: 'EDU' },
  { type: 'luck', label: '幸運' },
  { type: 'idea', label: 'アイデア' },
  { type: 'know', label: '知識' },
];

// 能力値の名前と、想定しうる最大/最小値
export const paramsRange: ParamRange[] = [
  {
    name: 'str',
    min: 3,
    max: 18,
  },
  {
    name: 'con',
    min: 3,
    max: 18,
  },
  {
    name: 'pow',
    min: 3,
    max: 18,
  },
  {
    name: 'dex',
    min: 3,
    max: 18,
  },
  {
    name: 'app',
    min: 3,
    max: 18,
  },
  {
    name: 'siz',
    min: 8,
    max: 18,
  },
  {
    name: 'int',
    min: 8,
    max: 18,
  },
  {
    name: 'edu',
    min: 6,
    max: 21,
  },
];
