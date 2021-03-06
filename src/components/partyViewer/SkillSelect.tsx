import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { changeSkillView } from 'modules/partyViewer/actions';
import { SkillType } from 'interfaces/skill';
import skillCategories from 'services/skills/skillCategories';

const Wrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  padding-bottom: 8px;
  margin-top: 32px;
  background: #f6f6f6;
`;

const Tab = styled.div`
  &:not(:first-child) {
    margin-left: 8px;
  }
`;

const Input = styled.input`
  display: none;

  &:checked + label {
    color: #fff;
    background: #444;
  }
`;

const Label = styled.label`
  display: inline-block;
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
    <Wrapper>
      {skillCategories.map((skillCategory) => (
        <Tab key={`${skillCategory.type}-radio`}>
          <Input
            type="radio"
            id={skillCategory.type}
            value={skillCategory.type}
            checked={selectedSkillView === skillCategory.type}
            onChange={(e) => handleChangeSkillView(e)}
          />
          <Label htmlFor={skillCategory.type}>{skillCategory.label}</Label>
        </Tab>
      ))}
    </Wrapper>
  );
};

export default SkillSelect;
