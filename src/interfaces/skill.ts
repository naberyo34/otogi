export default interface Skill {
  name: string;
  annotation?: string;
  point: number;
}

export interface SkillCategory {
  type: SkillType;
  label: SkillLabel;
}

export type SkillType =
  | 'combat'
  | 'explore'
  | 'behavior'
  | 'negotiation'
  | 'knowledge';

export type SkillKey =
  | 'combatSkills'
  | 'exploreSkills'
  | 'behaviorSkills'
  | 'negotiationSkills'
  | 'knowledgeSkills';

export type SkillLabel =
  | '戦闘系技能'
  | '探索系技能'
  | '行動系技能'
  | '交渉系技能'
  | '知識系技能';
