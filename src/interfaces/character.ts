import Skill from 'interfaces/skill';

// MEMO: 計算で出る値はわざわざ保存しない方針としている
export default interface Character {
  name: string;
  foundationParams: FoundationParams;
  hp: number; // 最大値ではなく現在値 (最大値は計算で出るため)
  mp: number; // 同上
  san: number; // 同上
  combatSkills: Skill[];
  exploreSkills: Skill[];
  behaviorSkills: Skill[];
  negotiationSkills: Skill[];
  knowledgeSkills: Skill[];
  [key: string]: any; // 仕方なかった
}

export interface FoundationParams {
  str: number;
  con: number;
  pow: number;
  dex: number;
  app: number;
  siz: number;
  int: number;
  edu: number;
}
