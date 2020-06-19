export default interface Skill {
  name: string;
  annotation?: string;
  point: number;
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
