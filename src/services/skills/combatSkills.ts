export interface Skill {
  name: string;
  annotation?: string;
  point: number;
}

// MEMO: 一旦キャラクター保管所を正として作成
// https://charasheet.vampire-blood.net/coc_pc_making.html
const combatSkills: Skill[] = [
  {
    name: '回避',
    point: 6, // DEX * 2
  },
  {
    name: 'キック',
    point: 25,
  },
  {
    name: '組み付き',
    point: 25,
  },
  {
    name: 'こぶし',
    point: 50,
  },
  {
    name: '頭突き',
    point: 10,
  },
  {
    name: '投擲',
    point: 25,
  },
  {
    name: 'マーシャルアーツ',
    point: 1,
  },
  {
    name: '拳銃',
    point: 20,
  },
  {
    name: 'サブマシンガン',
    point: 15,
  },
  {
    name: 'ショットガン',
    point: 30,
  },
  {
    name: 'ライフル',
    point: 25,
  },
];

export default combatSkills;
