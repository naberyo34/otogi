import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setCharacterSkills } from '../../modules/characterMaker/actions';
import { State } from '../../modules/index';
import { Skill } from '../../services/skills/combatSkills';

interface SkillName {
  name: string;
  label: string;
}

interface TableElements {
  combatTh: JSX.Element[];
  combatTd: JSX.Element[];
  exploreTh: JSX.Element[];
  exploreTd: JSX.Element[];
  behaviorTh: JSX.Element[];
  behaviorTd: JSX.Element[];
  negotiationTh: JSX.Element[];
  negotiationTd: JSX.Element[];
  knowledgeTh: JSX.Element[];
  knowledgeTd: JSX.Element[];
  [key: string]: JSX.Element[];
}

const Wrapper = styled.div`
  width: 100%;
  overflow-x: scroll;
`;

const Title = styled.h3`
  margin-top: 16px;
  font-size: 1.6rem;
`;

const Table = styled.table`
  margin-top: 8px;
  font-size: 1.2rem;
  border: 2px solid black;
  thead {
    color: white;
    background: black;
  }
  th {
    width: 60px;
    padding: 4px;
    border: 2px solid black;
  }
  td {
    padding: 4px;
    border: 2px solid black;
  }
  input {
    width: 60px;
  }
`;

const InputCharacterSkills: React.FC = () => {
  const dispatch = useDispatch();
  const newCharacter = useSelector(
    (state: State) => state.characterMaker.character
  );

  const skillNames: SkillName[] = [
    {
      name: 'combat',
      label: '戦闘系技能',
    },
    {
      name: 'explore',
      label: '探索系技能',
    },
    {
      name: 'behavior',
      label: '行動系技能',
    },
    {
      name: 'negotiation',
      label: '交渉系技能',
    },
    {
      name: 'knowledge',
      label: '知識系技能',
    },
  ];

  const tableElements: TableElements = {
    combatTh: [],
    combatTd: [],
    exploreTh: [],
    exploreTd: [],
    behaviorTh: [],
    behaviorTd: [],
    negotiationTh: [],
    negotiationTd: [],
    knowledgeTh: [],
    knowledgeTd: [],
  };

  const tables: JSX.Element[] = [];

  // th, tdを作成してtableElementsにひたすら格納する
  skillNames.forEach((skillName) => {
    const key = `${skillName.name}Skills`;
    const thKey = `${skillName.name}Th`;
    const tdKey = `${skillName.name}Td`;

    newCharacter[key].forEach((val: Skill) => {
      const th = <th>{val.name}</th>;
      const td = (
        <td>
          <input type="number" value={val.point} min={0} max={99} />
          {/* annotationキーを持っているときに表示 */}
          {(val.annotation || val.annotation === '') && (
            <>
              <br />
              <input type="text" value={val.annotation} placeholder="未指定" />
            </>
          )}
        </td>
      );
      tableElements[thKey].push(th);
      tableElements[tdKey].push(td);
    });
  });

  // 完成したtableElementsを使って完成形のテーブルを作る
  skillNames.forEach((skillName) => {
    const thKey = `${skillName.name}Th`;
    const tdKey = `${skillName.name}Td`;
    const table = (
      <>
        <Title>{skillName.label}</Title>
        <Table>
          <thead>
            <tr>{tableElements[thKey]}</tr>
          </thead>
          <tbody>
            <tr>{tableElements[tdKey]}</tr>
          </tbody>
        </Table>
      </>
    );

    tables.push(table);
  });

  return <Wrapper>{tables}</Wrapper>;
};

export default InputCharacterSkills;
