import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from 'services/firebase';
import { State } from 'modules';
import {
  getCharacters,
  setMyCharacterName,
  selectPartyCharacterName,
  setPartyCharacterNames,
  selectSkillTab,
} from 'modules/partyViewer/actions';
import Character from 'interfaces/character';

const Wrapper = styled.section`
  width: calc(100vw - 320px);
  min-width: 640px;
  height: 90vh;
  padding: 16px;
  overflow-y: scroll;
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

const SkillTab = styled.div`
  margin-top: 16px;
`;

const StatusCard = styled.div`
  padding: 16px;
  margin-top: 16px;
  background: aliceblue;
  border-radius: 4px;
`;

const CardName = styled.h3`
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
    (state: State) => state.partyViewer.characters
  );
  const myCharacterName = useSelector(
    (state: State) => state.partyViewer.myCharacterName
  );
  const selectedCharacterName = useSelector(
    (state: State) => state.partyViewer.selectedCharacterName
  );
  const partyCharacterNames = useSelector(
    (state: State) => state.partyViewer.partyCharacterNames
  );
  const skillTab = useSelector((state: State) => state.partyViewer.skillTab);
  /**
   * partyCharacters(String[])から実データ(Character[])を生成
   * @returns パーティメンバーの情報が格納された配列
   */
  const findPartyCharactersData = (): Character[] => {
    const dataArray: Character[] = [];

    partyCharacterNames.forEach((partyCharacterName) => {
      const data = characters.find(
        (character) => character.name === partyCharacterName
      );

      if (data) dataArray.push(data);
    });

    return dataArray;
  };

  // stateから検索したキャラクターの実データ これをレンダリングに使う
  const myCharacter = characters.find(
    (character) => character.name === myCharacterName
  );
  const partyCharacters: Character[] = findPartyCharactersData();
  // 選択したキャラクターをマイキャラクターとして設定
  const handleSelectMyCharacter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    dispatch(setMyCharacterName(value));
  };
  // パーティ追加対象のキャラクターを選択
  const handleSelectPartyCharacter = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    dispatch(selectPartyCharacterName(value));
  };
  // 選択したキャラクターをパーティに追加
  const handleAddPartyCharacters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addedParty = [...partyCharacterNames, selectedCharacterName];
    dispatch(setPartyCharacterNames(addedParty));
  };
  // 技能表示のタブ切り替え
  const handleChangeSkillTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(selectSkillTab(value));
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
    // バリデーション
    if (!value) {
      alert('入力値が不正です。数値のみが入力できます');
      return;
    }
    if (!myCharacter) {
      alert(
        'マイキャラクターが設定されていません。もしこのエラーが出たら開発チームまでご連絡ください'
      );
      return;
    }

    const valueInt = parseInt(value, 10);
    const updateParam = {
      [paramType]: valueInt,
    };

    // Firestoreを更新
    firestore.collection('character').doc(myCharacterName).update(updateParam);
  };

  useEffect(() => {
    const characterQueryCollection = firestore
      .collection('character')
      .orderBy('name', 'asc');

    // Firestoreが変更を検知したときに発火し、以下の処理を行う
    characterQueryCollection.onSnapshot((querySnapshot) => {
      const currentCharacters = characters;

      querySnapshot.docChanges().forEach((change) => {
        // ここでFirestoreから受け取る値はCharacter型のはずなので、キャストしている
        const rawData = change.doc.data() as Character;
        const targetIndex = currentCharacters.findIndex(
          (character) => character.name === rawData.name
        );
        switch (change.type) {
          // キャラクターデータが追加されたとき (※アプリ起動時にも発火する)
          case 'added':
            // すでに読み込みが完了している場合は無視する (画面遷移などでuseEffectが再度発火したとき用)
            if (characters.some((character) => character.name === rawData.name))
              return;

            currentCharacters.push(rawData);
            break;
          // キャラクターデータが変更されたとき
          case 'modified':
            currentCharacters.splice(targetIndex, 1, rawData);
            break;
          default:
            break;
        }
      });

      // 新しい配列を作成し、dispatchする
      // MEMO: 配列は新たに作成しないとReactが変更として検知しないことがある
      const returnCharacters = [...currentCharacters];
      dispatch(getCharacters(returnCharacters));
    });
    // MEMO: 初回にonSnapshotが読み込まれた時点であとはリッスンしてくれるので、useEffectは初回しか起動しない
    // eslint-disable-next-line
  }, []);

  return (
    <Wrapper>
      <p>あなたの名前は:</p>
      <select onChange={(e) => handleSelectMyCharacter(e)}>
        <option value="">選択してください</option>
        {characters.map((character) => (
          <option key={`$myCharacter-${character.name}`} value={character.name}>
            {character.name}
          </option>
        ))}
      </select>
      <PartyForm onSubmit={(e) => handleAddPartyCharacters(e)}>
        <p>
          パーティに追加
          (自分以外のキャラクターの情報が閲覧できます。リストはローカルでのみ表示されるので、他人とは同期しません):
        </p>
        <select onChange={(e) => handleSelectPartyCharacter(e)}>
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
      {/* TODO: 省略して書け */}
      <SkillTab>
        <p>技能表示</p>
        <input
          type="radio"
          name="skill"
          value="combat"
          checked={skillTab === 'combat'}
          onChange={(e) => handleChangeSkillTab(e)}
        />
        <span>戦闘系</span>
        <input
          type="radio"
          name="skill"
          value="explore"
          checked={skillTab === 'explore'}
          onChange={(e) => handleChangeSkillTab(e)}
        />
        <span>探索系</span>
        <input
          type="radio"
          name="skill"
          value="behavior"
          checked={skillTab === 'behavior'}
          onChange={(e) => handleChangeSkillTab(e)}
        />
        <span>行動系</span>
        <input
          type="radio"
          name="skill"
          value="negotiation"
          checked={skillTab === 'negotiation'}
          onChange={(e) => handleChangeSkillTab(e)}
        />
        <span>交渉系</span>
        <input
          type="radio"
          name="skill"
          value="knowledge"
          checked={skillTab === 'knowledge'}
          onChange={(e) => handleChangeSkillTab(e)}
        />
        <span>知識系</span>
      </SkillTab>
      {myCharacter && (
        <StatusCard>
          <p>マイキャラクター</p>
          <CardName>{myCharacter.name}</CardName>
          {/* TODO: もうちょっとどうにかしろ */}
          <ParamsTable>
            <thead>
              <tr>
                <th>HP</th>
                <th>MP</th>
                <th>SAN</th>
                <th>STR</th>
                <th>CON</th>
                <th>POW</th>
                <th>DEX</th>
                <th>APP</th>
                <th>SIZ</th>
                <th>INT</th>
                <th>EDU</th>
                <th>幸運</th>
                <th>アイデア</th>
                <th>知識</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={Math.floor(
                      (myCharacter.foundationParams.con +
                        myCharacter.foundationParams.siz) /
                        2
                    )}
                    value={myCharacter.hp}
                    onChange={(e) => handleChangeCurrentParam(e, 'hp')}
                  />{' '}
                  /{' '}
                  {Math.floor(
                    (myCharacter.foundationParams.con +
                      myCharacter.foundationParams.siz) /
                      2
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={myCharacter.foundationParams.pow}
                    value={myCharacter.mp}
                    onChange={(e) => handleChangeCurrentParam(e, 'mp')}
                  />{' '}
                  / {myCharacter.foundationParams.pow}
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={myCharacter.foundationParams.pow * 5}
                    value={myCharacter.san}
                    onChange={(e) => handleChangeCurrentParam(e, 'san')}
                  />{' '}
                  / {myCharacter.foundationParams.pow * 5}
                  <br />
                  不定: {myCharacter.foundationParams.pow * 4}
                </td>
                <td>{myCharacter.foundationParams.str}</td>
                <td>{myCharacter.foundationParams.con}</td>
                <td>{myCharacter.foundationParams.pow}</td>
                <td>{myCharacter.foundationParams.dex}</td>
                <td>{myCharacter.foundationParams.app}</td>
                <td>{myCharacter.foundationParams.siz}</td>
                <td>{myCharacter.foundationParams.int}</td>
                <td>{myCharacter.foundationParams.edu}</td>
                <td>{myCharacter.foundationParams.pow * 5}</td>
                <td>{myCharacter.foundationParams.int * 5}</td>
                <td>{myCharacter.foundationParams.edu * 5}</td>
              </tr>
            </tbody>
          </ParamsTable>
          {skillTab === 'combat' && (
            <ParamsTable>
              <thead>
                <tr>
                  {myCharacter.combatSkills.map((skill) => (
                    <th key={`myCharacter-${skill.name}`}>
                      {skill.name}
                      {skill.annotation && `(${skill.annotation})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {myCharacter.combatSkills.map((skill) => (
                    <td key={`myCharacter-${skill.point}`}>
                      {`${skill.point}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </ParamsTable>
          )}
          {skillTab === 'explore' && (
            <ParamsTable>
              <thead>
                <tr>
                  {myCharacter.exploreSkills.map((skill) => (
                    <th key={`myCharacter-${skill.name}`}>
                      {skill.name}
                      {skill.annotation && `(${skill.annotation})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {myCharacter.exploreSkills.map((skill) => (
                    <td key={`myCharacter-${skill.point}`}>
                      {`${skill.point}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </ParamsTable>
          )}
          {skillTab === 'behavior' && (
            <ParamsTable>
              <thead>
                <tr>
                  {myCharacter.behaviorSkills.map((skill) => (
                    <th key={`myCharacter-${skill.name}`}>
                      {skill.name}
                      {skill.annotation && `(${skill.annotation})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {myCharacter.behaviorSkills.map((skill) => (
                    <td key={`myCharacter-${skill.point}`}>
                      {`${skill.point}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </ParamsTable>
          )}
          {skillTab === 'negotiation' && (
            <ParamsTable>
              <thead>
                <tr>
                  {myCharacter.negotiationSkills.map((skill) => (
                    <th key={`myCharacter-${skill.name}`}>
                      {skill.name}
                      {skill.annotation && `(${skill.annotation})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {myCharacter.negotiationSkills.map((skill) => (
                    <td key={`myCharacter-${skill.point}`}>
                      {`${skill.point}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </ParamsTable>
          )}
          {skillTab === 'knowledge' && (
            <ParamsTable>
              <thead>
                <tr>
                  {myCharacter.knowledgeSkills.map((skill) => (
                    <th key={`myCharacter-${skill.name}`}>
                      {skill.name}
                      {skill.annotation && `(${skill.annotation})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {myCharacter.knowledgeSkills.map((skill) => (
                    <td key={`myCharacter-${skill.point}`}>
                      {`${skill.point}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </ParamsTable>
          )}
        </StatusCard>
      )}
      {partyCharacters.map((partyCharacter) => (
        <StatusCard key={`partyCharacter-${partyCharacter.name}`}>
          <CardName>{partyCharacter.name}</CardName>
          <ParamsTable>
            <thead>
              <tr>
                <th>HP</th>
                <th>MP</th>
                <th>SAN</th>
                <th>STR</th>
                <th>CON</th>
                <th>POW</th>
                <th>DEX</th>
                <th>APP</th>
                <th>SIZ</th>
                <th>INT</th>
                <th>EDU</th>
                <th>幸運</th>
                <th>アイデア</th>
                <th>知識</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {partyCharacter.hp} /{' '}
                  {Math.floor(
                    (partyCharacter.foundationParams.con +
                      partyCharacter.foundationParams.siz) /
                      2
                  )}
                </td>
                <td>
                  {partyCharacter.mp} / {partyCharacter.foundationParams.pow}
                </td>
                <td>
                  {partyCharacter.san} /{' '}
                  {partyCharacter.foundationParams.pow * 5}
                  <br />
                  不定: {partyCharacter.foundationParams.pow * 4}
                </td>
                <td>{partyCharacter.foundationParams.str}</td>
                <td>{partyCharacter.foundationParams.con}</td>
                <td>{partyCharacter.foundationParams.pow}</td>
                <td>{partyCharacter.foundationParams.dex}</td>
                <td>{partyCharacter.foundationParams.app}</td>
                <td>{partyCharacter.foundationParams.siz}</td>
                <td>{partyCharacter.foundationParams.int}</td>
                <td>{partyCharacter.foundationParams.edu}</td>
                <td>{partyCharacter.foundationParams.pow * 5}</td>
                <td>{partyCharacter.foundationParams.int * 5}</td>
                <td>{partyCharacter.foundationParams.edu * 5}</td>
              </tr>
            </tbody>
          </ParamsTable>
          {skillTab === 'combat' && (
            <ParamsTable>
              <thead>
                <tr>
                  {partyCharacter.combatSkills.map((skill) => (
                    <th key={`partyCharacter-${skill.name}`}>
                      {skill.name}
                      {skill.annotation && `(${skill.annotation})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {partyCharacter.combatSkills.map((skill) => (
                    <td key={`partyCharacter-${skill.point}`}>
                      {`${skill.point}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </ParamsTable>
          )}
          {skillTab === 'explore' && (
            <ParamsTable>
              <thead>
                <tr>
                  {partyCharacter.exploreSkills.map((skill) => (
                    <th key={`partyCharacter-${skill.name}`}>
                      {skill.name}
                      {skill.annotation && `(${skill.annotation})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {partyCharacter.exploreSkills.map((skill) => (
                    <td key={`partyCharacter-${skill.point}`}>
                      {`${skill.point}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </ParamsTable>
          )}
          {skillTab === 'behavior' && (
            <ParamsTable>
              <thead>
                <tr>
                  {partyCharacter.behaviorSkills.map((skill) => (
                    <th key={`partyCharacter-${skill.name}`}>
                      {skill.name}
                      {skill.annotation && `(${skill.annotation})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {partyCharacter.behaviorSkills.map((skill) => (
                    <td key={`partyCharacter-${skill.point}`}>
                      {`${skill.point}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </ParamsTable>
          )}
          {skillTab === 'negotiation' && (
            <ParamsTable>
              <thead>
                <tr>
                  {partyCharacter.negotiationSkills.map((skill) => (
                    <th key={`partyCharacter-${skill.name}`}>
                      {skill.name}
                      {skill.annotation && `(${skill.annotation})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {partyCharacter.negotiationSkills.map((skill) => (
                    <td key={`partyCharacter-${skill.point}`}>
                      {`${skill.point}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </ParamsTable>
          )}
          {skillTab === 'knowledge' && (
            <ParamsTable>
              <thead>
                <tr>
                  {partyCharacter.knowledgeSkills.map((skill) => (
                    <th key={`partyCharacter-${skill.name}`}>
                      {skill.name}
                      {skill.annotation && `(${skill.annotation})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {partyCharacter.knowledgeSkills.map((skill) => (
                    <td key={`partyCharacter-${skill.point}`}>
                      {`${skill.point}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </ParamsTable>
          )}
        </StatusCard>
      ))}
    </Wrapper>
  );
};

export default PartyViewer;
