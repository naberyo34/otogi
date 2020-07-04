import React from 'react';
import styled from 'styled-components';
import Character from 'interfaces/character';
import Skill, { SkillType } from 'interfaces/skill';
import skillCategories from 'services/skills/skillCategories';

interface Props {
  character: Character;
  selectedSkillView: SkillType;
}

interface StyledProps {
  point: number;
}

const Table = styled.table`
  thead {
    background: #f6f6f6;
  }

  th {
    padding: 8px;
    white-space: nowrap;
  }
`;

const Point = styled.td<StyledProps>`
  padding: 8px;
  font-size: 1.6rem;
  background: ${(props) => {
    const { point } = props;

    if (point >= 80) return '#f5b041';
    if (point >= 60) return '#f8c471';
    if (point >= 40) return '#fad7a0';
    if (point >= 20) return '#fdebd0';
    return 'inherit';
  }};
`;

const Percent = styled.span`
  font-size: 1.2rem;
`;

const SkillsTable: React.FC<Props> = (props) => {
  const { character, selectedSkillView } = props;

  return (
    <>
      {skillCategories.map((skillCategory) => (
        <>
          {selectedSkillView === skillCategory.type && (
            <Table key={`${character.name}-${skillCategory.type}`}>
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
                      <Point
                        key={`${character.name}-${skill.name}-point`}
                        point={skill.point}
                      >
                        <span>
                          {`${skill.point}`}
                          <Percent>%</Percent>
                        </span>
                      </Point>
                    )
                  )}
                </tr>
              </tbody>
            </Table>
          )}
        </>
      ))}
    </>
  );
};

export default SkillsTable;
