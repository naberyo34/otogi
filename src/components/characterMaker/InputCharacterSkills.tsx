import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from 'modules';
import { changeCharacterSkills } from 'modules/characterMaker/actions';
import Skill, { SkillType, SkillKey } from 'interfaces/skill';
import skillCategories from 'services/skills/skillCategories';

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
    let valueInt = parseInt(value, 10);

    // valueIntがNaNのときは0として扱う
    if (!valueInt) valueInt = 0;
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
      alert('FATAL ERR: 対象のスキルが見つかりません');
      return;
    }

    // 対象スキルがアノテーションを含む場合は、newSkillにもアノテーションを入れる
    if (target.annotation || target.annotation === '') {
      newSkill.annotation = target.annotation;
    }

    // 対象スキルが配列のどこにあるか検索し、そこだけ新しい情報に置換する
    const targetIndex = currentSkills.findIndex(
      (currentSkill) => currentSkill.name === skillName
    );
    currentSkills.splice(targetIndex, 1, newSkill);

    // Storeを更新
    dispatch(changeCharacterSkills({ skillKey, skills: currentSkills }));
  };

  // アノテーション(ex: 芸術(絵画)のような注釈)を変更したときにStoreを更新する
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
      alert('FATAL ERR: 対象のスキルが見つかりません');
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
  skillCategories.forEach((skillCategory) => {
    const key = `${skillCategory.type}Skills`;
    const thKey = `${skillCategory.type}Th`;
    const tdKey = `${skillCategory.type}Td`;

    makingCharacter[key].forEach((skill: Skill) => {
      const th = <th>{skill.name}</th>;
      const td = (
        <td>
          <input
            type="number"
            value={skill.point === 0 ? '' : skill.point}
            min={0}
            max={99}
            onChange={(e) =>
              handleChangeSkillPoint(e, skillCategory.type, skill.name)
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
                  handleChangeAnnotation(e, skillCategory.type, skill.name)
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
  skillCategories.forEach((skillCategory) => {
    const thKey = `${skillCategory.type}Th`;
    const tdKey = `${skillCategory.type}Td`;
    const table = (
      <table>
        <thead>
          <tr>{tableElements[thKey]}</tr>
        </thead>
        <tbody>
          <tr>{tableElements[tdKey]}</tr>
        </tbody>
      </table>
    );

    tables.push(table);
  });

  return <>{tables}</>;
};

export default InputCharacterSkills;
