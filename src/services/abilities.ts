export type ParamType =
  | 'str'
  | 'con'
  | 'pow'
  | 'dex'
  | 'app'
  | 'siz'
  | 'int'
  | 'edu';
interface Ability {
  name: ParamType;
  min: number;
  max: number;
}

// 能力値の名前と、想定しうる最大/最小値
const abilities: Ability[] = [
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

export default abilities;
