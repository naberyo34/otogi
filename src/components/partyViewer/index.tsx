import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from '../../services/firebase';
import {
  getCharacters,
  setMyCharacterName,
  selectPartyCharacterName,
  setPartyCharacterNames,
  selectSkillTab,
} from '../../modules/partyViewer/actions';
import { State } from '../../modules/index';
import { Character } from '../../modules/characterMaker/reducers';

const Wrapper = styled.section`
  width: calc(100vw - 320px);
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

const ParamsTable = styled.table`
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
    border: 2px solid gray;
  }
`;

const SkillText = styled.p`
  font-size: 1.2rem;
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
          <p>自分のキャラクター</p>
          <p>{myCharacter.name}</p>
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
                    max={myCharacter.pow * 5}
                    value={myCharacter.san}
                    onChange={(e) => handleChangeCurrentParam(e, 'san')}
                  />{' '}
                  / {myCharacter.pow * 5}
                  <br />
                  不定の狂気: {myCharacter.pow * 4}
                </td>
                <td>{myCharacter.str}</td>
                <td>{myCharacter.con}</td>
                <td>{myCharacter.pow}</td>
                <td>{myCharacter.dex}</td>
                <td>{myCharacter.app}</td>
                <td>{myCharacter.siz}</td>
                <td>{myCharacter.int}</td>
                <td>{myCharacter.edu}</td>
                <td>{myCharacter.luck}</td>
                <td>{myCharacter.idea}</td>
              </tr>
            </tbody>
          </ParamsTable>
        </StatusCard>
      )}
      {partyCharacters.map((partyCharacter) => (
        <StatusCard key={`partyCharacter-${partyCharacter.name}`}>
          <p>{partyCharacter.name}</p>
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {partyCharacter.hp} / {partyCharacter.h}
                </td>
                <td>
                  {partyCharacter.mp} / {partyCharacter.foundationParams.pow}
                </td>
                <td>
                  {partyCharacter.san} /{' '}
                  {partyCharacter.foundationParams.pow * 5}
                  <br />
                  不定の狂気: {partyCharacter.pow * 4}
                </td>
                <td>{partyCharacter.str}</td>
                <td>{partyCharacter.con}</td>
                <td>{partyCharacter.pow}</td>
                <td>{partyCharacter.dex}</td>
                <td>{partyCharacter.app}</td>
                <td>{partyCharacter.siz}</td>
                <td>{partyCharacter.int}</td>
                <td>{partyCharacter.edu}</td>
                <td>{partyCharacter.luck}</td>
                <td>{partyCharacter.idea}</td>
              </tr>
            </tbody>
          </ParamsTable>
        </StatusCard>
      ))}
    </Wrapper>
  );
};

export default PartyViewer;
