import React from 'react';
import styled from 'styled-components';
import Character from 'interfaces/character';
import Skill, { SkillType } from 'interfaces/skill';
import skillCategories from 'services/skills/skillCategories';

interface Props {
  character: Character;
  selectedSkillView: SkillType;
}

const SkillsTable: React.FC<Props> = (props) => {
  const { character, selectedSkillView } = props;

  return (
    <>
      {skillCategories.map((skillCategory) => (
        <>
          {selectedSkillView === skillCategory.type && (
            <table key={`${character.name}-${skillCategory.type}`}>
              <thead>
                <tr>
                  {(character[`${skillCategory.type}Skills`] as Skill[]).map(
                    (skill) => (
                      <th key={`${character.name}-${skill.name}`}>
                        {skill.name}
                        {skill.annotation && `(${skill.annotation})`}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {(character[`${skillCategory.type}Skills`] as Skill[]).map(
                    (skill) => (
                      <td key={`${character.name}-${skill.name}-point`}>
                        {`${skill.point}%`}
                      </td>
                    )
                  )}
                </tr>
              </tbody>
            </table>
          )}
        </>
      ))}
    </>
  );
};

export default SkillsTable;
