interface Ability {
  name: string;
  min: number;
  max: number;
}

// 能力値の名前と、想定しうる最大/最小値
const abilities: Ability[] = [
  {
    name: 'STR',
    min: 3,
    max: 18,
  },
  {
    name: 'CON',
    min: 3,
    max: 18,
  },
  {
    name: 'POW',
    min: 3,
    max: 18,
  },
  {
    name: 'DEX',
    min: 3,
    max: 18,
  },
  {
    name: 'APP',
    min: 3,
    max: 18,
  },
  {
    name: 'SIZ',
    min: 8,
    max: 18,
  },
  {
    name: 'INT',
    min: 8,
    max: 18,
  },
  {
    name: 'EDU',
    min: 6,
    max: 21,
  },
];

export default abilities;
