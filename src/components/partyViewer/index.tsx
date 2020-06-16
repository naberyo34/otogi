import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from '../../services/firebase';
import {
  getCharacters,
  setMyCharacter,
  selectPartyCharacter,
  setPartyCharacters,
  selectSkillTab,
} from '../../modules/partyViewer/actions';
import { State } from '../../modules/index';
import { initialCharacter } from '../../modules/characterMaker/reducers';

const Wrapper = styled.section`
  width: calc(100vw - 320px);
  height: 90vh;
  padding: 16px;
  overflow-y: scroll;
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
  // MEMO: anyにしないとタブが効かなくなる……
  const myCharacter: any = useSelector(
    (state: State) => state.partyViewer.myCharacter
  );
  const selectedCharacter = useSelector(
    (state: State) => state.partyViewer.selectedCharacter
  );
  const partyCharacters: any = useSelector(
    (state: State) => state.partyViewer.partyCharacters
  );
  const skillTab = useSelector((state: State) => state.partyViewer.skillTab);
  // 選択したキャラクターをマイキャラクターとして設定
  const handleChoosedMyCharacter = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const choosedCharacterName = e.target.value;
    const choosedCharacter = characters.find(
      (character) => character.name === choosedCharacterName
    );

    // 検索に失敗した場合はStateを初期化して返す
    // (ex: セレクトボックスを'選択してください'に戻したときなど)
    if (!choosedCharacter) {
      dispatch(setMyCharacter(initialCharacter));
      return;
    }

    dispatch(setMyCharacter(choosedCharacter));
  };

  // 選択したキャラクターをパーティ追加対象として設定
  const handleSelectPartyCharacter = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCharacterName = e.target.value;

    dispatch(selectPartyCharacter(selectedCharacterName));
  };

  // selectされているキャラクターをパーティに追加
  const handleAddPartyCharacters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = characters.find(
      (character) => selectedCharacter === character.name
    );

    if (!target) return;

    // 現在のパーティに対象キャラクターを追加し、Storeを更新
    // MEMO: 配列stateの操作にpushのような破壊的メソッドは使わないほうがいい
    const latestParty = [...partyCharacters, target];
    dispatch(setPartyCharacters(latestParty));
  };

  const handleChangeSkillTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(selectSkillTab(value));
  };

  useEffect(() => {
    // TODO: DocumentData型とCharacter型を共用する方法がわからない
    const addedCharacters: any = [];
    const characterQueryCollection = firestore
      .collection('character')
      .orderBy('name', 'asc');

    // Firestoreの変更を検知し, キャラクターリストを更新する
    characterQueryCollection.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        // Firestoreにデータが追加されたとき (※アプリ起動時にも発火する)
        if (change.type === 'added') {
          const rawData: firebase.firestore.DocumentData = change.doc.data();
          addedCharacters.push(rawData);
        }
      });

      const latestCharacters = [...characters, ...addedCharacters];
      dispatch(getCharacters(latestCharacters));
    });
  }, []);

  return (
    <Wrapper>
      <p>あなたの名前は:</p>
      <select onChange={(e) => handleChoosedMyCharacter(e)}>
        <option value="">選択してください</option>
        {characters.map((character) => (
          <option key={`$myCharacter-${character.name}`} value={character.name}>
            {character.name}
          </option>
        ))}
      </select>
      <form onSubmit={(e) => handleAddPartyCharacters(e)}>
        <p>パーティに追加:</p>
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
      </form>
      {/* TODO: 省略して書け */}
      <p>技能</p>
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
      {myCharacter.name && (
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
                  {myCharacter.hp.current} / {myCharacter.hp.max}
                </td>
                <td>
                  {myCharacter.mp.current} / {myCharacter.mp.max}
                </td>
                <td>
                  {myCharacter.san.current} / {myCharacter.san.max}
                  <br />
                  不定の狂気: {myCharacter.san.madness}
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
          <SkillText>{myCharacter.skill[skillTab]}</SkillText>
        </StatusCard>
      )}
      {partyCharacters.map((partyCharacter: any) => (
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
                  {partyCharacter.hp.current} / {partyCharacter.hp.max}
                </td>
                <td>
                  {partyCharacter.mp.current} / {partyCharacter.mp.max}
                </td>
                <td>
                  {partyCharacter.san.current} / {partyCharacter.san.max}
                  <br />
                  不定の狂気: {partyCharacter.san.madness}
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
          <SkillText>{partyCharacter.skill[skillTab]}</SkillText>
        </StatusCard>
      ))}
    </Wrapper>
  );
};

export default PartyViewer;
