import { ParamRange } from 'interfaces/param';

// 能力値の名前と、想定しうる最大/最小値
const params: ParamRange[] = [
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

export default params;
