import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { changeSkillView } from 'modules/partyViewer/actions';
import { SkillType } from 'interfaces/skill';
import skillCategories from 'services/skills/skillCategories';

const Input = styled.input`
  display: none;
`;

interface Props {
  selectedSkillView: SkillType;
}

const SkillSelect: React.FC<Props> = (props) => {
  const { selectedSkillView } = props;
  const dispatch = useDispatch();

  // 技能表示のタブ切り替え
  const handleChangeSkillView = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(changeSkillView(value));
  };

  return (
    <div>
      {skillCategories.map((skillCategory) => (
        <React.Fragment key={`${skillCategory.type}-radio`}>
          <Input
            type="radio"
            id={skillCategory.type}
            value={skillCategory.type}
            checked={selectedSkillView === skillCategory.type}
            onChange={(e) => handleChangeSkillView(e)}
          />
          <label htmlFor={skillCategory.type}>{skillCategory.label}</label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SkillSelect;
