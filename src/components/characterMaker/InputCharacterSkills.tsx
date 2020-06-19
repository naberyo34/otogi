import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from 'modules';
import { changeCharacterSkills } from 'modules/characterMaker/actions';
import Skill, { SkillType, SkillKey } from 'interfaces/skill';

interface Category {
  name: SkillType;
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
  border: 2px solid gray;
  thead {
    color: white;
    background: gray;
  }
  th {
    width: 60px;
    padding: 4px;
    border: 2px solid gray;
  }
  td {
    padding: 4px;
    border: 2px solid gray;
  }
  input {
    width: 60px;
  }
`;

const InputCharacterSkills: React.FC = () => {
  const dispatch = useDispatch();
  const makingCharacter = useSelector(
    (state: State) => state.characterMaker.makingCharacter
  );

  // スキルポイントを変更したときにStoreを更新する
  const handleChangeSkillPoint = (
    e: React.ChangeEvent<HTMLInputElement>,
    skillType: SkillType,
    skillName: string
  ) => {
    const { value } = e.target;
    const valueInt = parseInt(value, 10);

    // 0未満、100以上の値は弾く
    if (valueInt < 0 || valueInt > 99) {
      alert('入力値が小さすぎるか大きすぎます。0 ~ 99 が入力できます');
      return;
    }

    const skillKey = `${skillType}Skills` as SkillKey;
    const currentSkills: Skill[] = makingCharacter[skillKey];
    const newSkill: Skill = {
      name: skillName,
      point: valueInt,
    };

    // 対象スキルを検索
    const target = currentSkills.find(
      (currentSkill) => currentSkill.name === skillName
    );

    if (!target) {
      alert(
        '対象のスキルが見つかりません。もしこのエラーが出たら開発チームまでご連絡ください'
      );
      return;
    }

    // 対象スキルがアノテーションを含む場合は、newSkillにもアノテーションを入れる
    if (target.annotation || target.annotation === '') {
      newSkill.annotation = target?.annotation;
    }

    // 対象スキルが配列のどこにあるか検索し、そこだけ新しい情報に置換する
    const targetIndex = currentSkills.findIndex(
      (currentSkill) => currentSkill.name === skillName
    );
    currentSkills.splice(targetIndex, 1, newSkill);

    // 念のため新たな配列を作り直し、Storeに反映
    const returnSkills = [...currentSkills];
    dispatch(changeCharacterSkills({ skillKey, skills: returnSkills }));
  };

  // アノテーション(ex: 芸術(BL)のような注釈)を変更したときにStoreを更新する
  const handleChangeAnnotation = (
    e: React.ChangeEvent<HTMLInputElement>,
    skillType: SkillType,
    skillName: string
  ) => {
    const { value } = e.target;
    const skillKey = `${skillType}Skills` as SkillKey;
    const currentSkills: Skill[] = makingCharacter[skillKey];
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

    const targetIndex = currentSkills.findIndex(
      (currentSkill) => currentSkill.name === skillName
    );
    currentSkills.splice(targetIndex, 1, newSkill);

    const returnSkills = [...currentSkills];
    dispatch(changeCharacterSkills({ skillKey, skills: returnSkills }));
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

    makingCharacter[key].forEach((skill: Skill) => {
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
