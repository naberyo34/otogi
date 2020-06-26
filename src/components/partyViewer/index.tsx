import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from 'modules';
import {
  setMyCharacter,
  setPartyCharacters,
  changePartyCharacter,
  changeSkillView,
} from 'modules/partyViewer/actions';
import { updateCharacter } from 'modules/firebase/actions';
import Character from 'interfaces/character';
import { AllParams } from 'interfaces/param';
import Skill from 'interfaces/skill';
import { allParamCategories } from 'services/params';
import skillCategories from 'services/skills/skillCategories';

const Wrapper = styled.section`
  margin-left: 16px;
`;

const PartyForm = styled.form`
  margin-top: 16px;

  button {
    margin-left: 8px;
    color: white;
    cursor: pointer;
    background: black;
    border-radius: 8px;
  }
`;

const SkillSelect = styled.div`
  position: sticky;
  top: 0;
  padding: 16px 0;
  font-size: 1.2rem;
  background: white;

  input {
    &:not(:first-child) {
      margin-left: 8px;
    }
  }
`;

const Status = styled.div`
  padding: 16px;
  margin-top: 16px;
  background: aliceblue;
  border-radius: 4px;
`;

const StatusName = styled.h3`
  font-size: 1.6rem;
`;

const ParamsTable = styled.table`
  margin-top: 8px;
  font-size: 1.2rem;
  border: 2px solid gray;
  thead {
    color: white;
    background: gray;
  }
  th {
    padding: 4px;
    border: 2px solid gray;
  }
  td {
    padding: 4px;
    line-height: 1.5;
    text-align: right;
    border: 2px solid gray;
  }
  input {
    width: 40px;
  }
`;

const PartyViewer: React.FC = () => {
  const dispatch = useDispatch();
  const characters = useSelector(
    (state: State) => state.firebaseReducer.characters
  );
  const {
    myCharacter,
    selectedCharacter,
    partyCharacters,
    selectedSkillView,
  } = useSelector((state: State) => state.partyViewer);

  /**
   * partyCharacters(String[])から実データ(Character[])を生成
   * @returns パーティメンバーの情報が格納された配列
   */
  const findPartyCharactersData = (): Character[] => {
    const targetArray: Character[] = [];

    partyCharacters.forEach((partyCharacter) => {
      const target = characters.find(
        (character) => character.name === partyCharacter
      );

      if (target) targetArray.push(target);
    });

    return targetArray;
  };

  // stateから検索したキャラクターの実データ これをレンダリングに使う
  const myCharacterData = characters.find(
    (character) => character.name === myCharacter
  );
  // 同上
  const partyCharactersData: Character[] = findPartyCharactersData();

  // 選択したキャラクターをマイキャラクターとして設定
  const handleSetMyCharacter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    dispatch(setMyCharacter(value));
  };
  // パーティ追加対象のキャラクターを選択
  const handleChangePartyCharacter = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    dispatch(changePartyCharacter(value));
  };
  // 選択したキャラクターをパーティに追加
  const handleSetPartyCharacters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addedParty = [...partyCharacters, selectedCharacter];
    dispatch(setPartyCharacters(addedParty));
  };
  // 技能表示のタブ切り替え
  const handleChangeSkillView = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(changeSkillView(value));
  };

  /**
   * 可変パラメータの値変更をFirestoreに反映する
   * @param e イベント
   * @param paramType 対象のパラメータ(ex: 'hp' とか)
   */
  const handleChangeCurrentParam = (
    e: React.ChangeEvent<HTMLInputElement>,
    paramType: 'hp' | 'mp' | 'san'
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

    // マイキャラクターが見つからない(想定外)場合は致命的なエラーを返す
    if (!myCharacter) {
      alert('FATAL ERR: マイキャラクターが見つかりません');
      return;
    }

    // Saga経由でFirestoreを更新
    dispatch(
      updateCharacter.start({
        target: myCharacter,
        key: paramType,
        value: valueInt,
      })
    );
  };

  /**
   * キャラクター情報を受け取ってパラメータのJSXElmentを作成
   * @param character キャラクター情報
   * @param isMyCharacter これが自分のキャラクターならtrueを渡す
   */
  const generateParamsTable = (
    character: Character,
    isMyCharacter?: boolean
  ) => {
    const characterAllParams: AllParams = {
      hp: character.hp,
      maxhp: Math.round(
        (character.foundationParams.con + character.foundationParams.siz) / 2
      ),
      mp: character.mp,
      maxmp: character.foundationParams.pow,
      san: character.san,
      maxsan: character.foundationParams.pow * 5,
      madness: character.foundationParams.pow * 4,
      str: character.foundationParams.str,
      con: character.foundationParams.con,
      pow: character.foundationParams.pow,
      dex: character.foundationParams.dex,
      app: character.foundationParams.app,
      siz: character.foundationParams.siz,
      int: character.foundationParams.int,
      edu: character.foundationParams.edu,
      luck: character.foundationParams.pow * 5,
      idea: character.foundationParams.int * 5,
      know: character.foundationParams.edu * 5,
    };
    const paramsTable = (
      <ParamsTable>
        <thead>
          <tr>
            {allParamCategories.map((paramCategory) => (
              <th key={`${character.name}-${paramCategory.type}`}>
                {paramCategory.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {allParamCategories.map((paramCategory) => {
              switch (paramCategory.type) {
                case 'hp':
                case 'mp':
                case 'san': {
                  const paramType = paramCategory.type as 'hp' | 'mp' | 'san';
                  const targetKey = {
                    current: paramCategory.type,
                    max: `max${paramCategory.type}`,
                  };
                  const current = characterAllParams[targetKey.current];
                  const max = characterAllParams[targetKey.max];
                  const isSan = paramType === 'san';

                  return (
                    <td key={`${character.name}-${paramType}-point`}>
                      {isMyCharacter ? (
                        <input
                          type="number"
                          min={0}
                          max={isSan ? 99 : max}
                          value={current === 0 ? '' : current}
                          onChange={(e) =>
                            handleChangeCurrentParam(e, paramType)
                          }
                        />
                      ) : (
                        <>{current}</>
                      )}{' '}
                      / {max}
                      {isSan && (
                        <>
                          <br />
                          不定: {characterAllParams.madness}
                        </>
                      )}
                    </td>
                  );
                }
                default: {
                  return (
                    <td key={`${character.name}-${paramCategory.type}-point`}>
                      {characterAllParams[paramCategory.type]}
                    </td>
                  );
                }
              }
            })}
          </tr>
        </tbody>
      </ParamsTable>
    );

    return paramsTable;
  };

  /**
   * キャラクター情報を受け取ってスキルのJSXElement (配列) を作成
   * @param character キャラクター情報
   */
  const generateSkillsTables = (character: Character) => {
    const skillsTables: JSX.Element[] = [];

    skillCategories.forEach((skillCategory) => {
      const targetKey = `${skillCategory.type}Skills`;
      const targetSkills = character[targetKey] as Skill[];

      const skillsTable = (
        <ParamsTable>
          <thead>
            <tr>
              {targetSkills.map((targetSkill) => (
                <th key={`${character.name}-${targetSkill.name}`}>
                  {targetSkill.name}
                  {targetSkill.annotation && `(${targetSkill.annotation})`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {targetSkills.map((targetSkill) => (
                <td key={`${character.name}-${targetSkill.name}-point`}>
                  {`${targetSkill.point}%`}
                </td>
              ))}
            </tr>
          </tbody>
        </ParamsTable>
      );

      skillsTables.push(skillsTable);
    });

    return skillsTables;
  };

  /**
   * generateParamsTableとgenerateSkillsTablesを組み合わせてレンダリング用のJSXを作成
   * @param character キャラクター
   * @param isMyCharacter これが自分のキャラクターならtrueを渡す
   */
  const generateStatus = (character: Character, isMyCharacter?: boolean) => {
    const paramsTable = generateParamsTable(character, isMyCharacter);
    const skillsTables = generateSkillsTables(character);
    return (
      <Status key={`${character.name}-status`}>
        {isMyCharacter && <p>マイキャラクター</p>}
        <StatusName>{character.name}</StatusName>
        {paramsTable}
        {selectedSkillView === 'combat' && skillsTables[0]}
        {selectedSkillView === 'explore' && skillsTables[1]}
        {selectedSkillView === 'behavior' && skillsTables[2]}
        {selectedSkillView === 'negotiation' && skillsTables[3]}
        {selectedSkillView === 'knowledge' && skillsTables[4]}
      </Status>
    );
  };

  // スキル表示を切り替えるラジオボタンを作成
  const skillSelectRadioButtons: JSX.Element[] = [];

  skillCategories.forEach((skillCategory) => {
    const radio = (
      <React.Fragment key={`${skillCategory.type}-radio`}>
        <input
          type="radio"
          id={skillCategory.type}
          value={skillCategory.type}
          checked={selectedSkillView === skillCategory.type}
          onChange={(e) => handleChangeSkillView(e)}
        />
        <label htmlFor={skillCategory.type}>{skillCategory.label}</label>
      </React.Fragment>
    );

    skillSelectRadioButtons.push(radio);
  });

  return (
    <Wrapper>
      <p>あなたの名前は:</p>
      <select onChange={(e) => handleSetMyCharacter(e)}>
        <option value="">選択してください</option>
        {characters.map((character) => (
          <option key={`$myCharacter-${character.name}`} value={character.name}>
            {character.name}
          </option>
        ))}
      </select>
      <PartyForm onSubmit={(e) => handleSetPartyCharacters(e)}>
        <p>
          パーティに追加
          (自分以外のキャラクターの情報が閲覧できます。自分だけが見えています):
        </p>
        <select onChange={(e) => handleChangePartyCharacter(e)}>
          <option value="">選択してください</option>
          {characters.map((character) => (
            <option
              key={`$partyCharacter-${character.name}`}
              value={character.name}
            >
              {character.name}
            </option>
          ))}
        </select>
        <button type="submit">追加</button>
      </PartyForm>
      <SkillSelect>{skillSelectRadioButtons}</SkillSelect>
      {myCharacterData && generateStatus(myCharacterData, true)}
      {partyCharactersData.map((partyCharacterData) =>
        generateStatus(partyCharacterData)
      )}
    </Wrapper>
  );
};

export default PartyViewer;
