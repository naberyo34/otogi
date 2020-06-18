import { Skill } from './combatSkills';

const negotiationSkills: Skill[] = [
  {
    name: '言いくるめ',
    point: 5,
  },
  {
    name: '信用',
    point: 15,
  },
  {
    name: '説得',
    point: 15,
  },
  {
    name: '値切り',
    point: 5,
  },
  {
    name: '母国語',
    annotation: '',
    point: 30, // EDU * 5
  },
];

export default negotiationSkills;
