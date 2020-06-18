import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setCharacterSkills } from '../../modules/characterMaker/actions';
import { State } from '../../modules/index';
import { Skill } from '../../services/skills/combatSkills';

interface Category {
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

  // スキルポイントを変更したときにStoreを更新する
  const handleChangeSkillPoint = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: string,
    skillName: string
  ) => {
    const { value } = e.target;
    const valueInt = parseInt(value, 10);

    // 0未満、100以上の値は弾く
    if (valueInt < 0 || valueInt > 99) {
      alert('入力値が小さすぎるか大きすぎます。0 ~ 99 が入力できます');
      return;
    }

    const skillKey = `${category}Skills`;
    const currentSkills: Skill[] = newCharacter[skillKey];
    const newSkill: Skill = {
      name: skillName,
      point: valueInt,
    };
    // 対象スキルがアノテーションを含む場合は、newSkillにもアノテーションを入れる
    const target = currentSkills.find(
      (currentSkill) => currentSkill.name === skillName
    );

    if (!target) {
      alert(
        '対象のスキルが見つかりません。もしこのエラーが出たら開発チームまでご連絡ください'
      );
      return;
    }

    if (target.annotation || target.annotation === '') {
      newSkill.annotation = target?.annotation;
    }

    // 対象のスキルが配列のどこにあるか検索し、そこだけ置き換える
    const targetIndex = currentSkills.findIndex(
      (currentSkill) => currentSkill.name === skillName
    );

    currentSkills.splice(targetIndex, 1, newSkill);

    const returnSkills = [...currentSkills];

    dispatch(setCharacterSkills({ [skillKey]: returnSkills }));
  };

  // アノテーション(ex: 芸術(BL)のような注釈)を変更したときにStoreを更新する
  const handleChangeAnnotation = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: string,
    skillName: string
  ) => {
    const { value } = e.target;
    const skillKey = `${category}Skills`
    const currentSkills: Skill[] = newCharacter[skillKey];
    const target = currentSkills.find(
      (currentSkill) => currentSkill.name === skillName
    );

    if (!target) {
      alert(
        '対象のスキルが見つかりません。もしこのエラーが出たら開発チームまでご連絡ください'
      );
      return;
    }

    const newSkill: Skill = {
      name: skillName,
      point: target.point,
      annotation: value,
    };

    // 対象のスキルが配列のどこにあるか検索し、そこだけ置き換える
    const targetIndex = currentSkills.findIndex(
      (currentSkill) => currentSkill.name === skillName
    );

    currentSkills.splice(targetIndex, 1, newSkill);

    const returnSkills = [...currentSkills];

    dispatch(setCharacterSkills({[skillKey]: returnSkills}));
  };

  const categories: Category[] = [
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
  categories.forEach((category) => {
    const key = `${category.name}Skills`;
    const thKey = `${category.name}Th`;
    const tdKey = `${category.name}Td`;

    newCharacter[key].forEach((skill: Skill) => {
      const th = <th>{skill.name}</th>;
      const td = (
        <td>
          <input
            type="number"
            value={skill.point}
            min={0}
            max={99}
            onChange={(e) =>
              handleChangeSkillPoint(e, category.name, skill.name)
            }
          />
          {/* annotationキーを持っているときに表示 */}
          {(skill.annotation || skill.annotation === '') && (
            <>
              <br />
              <input
                type="text"
                value={skill.annotation}
                placeholder="未指定"
                onChange={(e) =>
                  handleChangeAnnotation(e, category.name, skill.name)
                }
              />
            </>
          )}
        </td>
      );
      tableElements[thKey].push(th);
      tableElements[tdKey].push(td);
    });
  });

  // 完成したtableElementsを使って完成形のテーブルを作る
  categories.forEach((category) => {
    const thKey = `${category.name}Th`;
    const tdKey = `${category.name}Td`;
    const table = (
      <>
        <Title>{category.label}</Title>
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
