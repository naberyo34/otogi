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
import {
  Character,
  initialCharacter,
} from '../../modules/characterMaker/reducers';

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
  const myCharacter: Character = useSelector(
    (state: State) => state.partyViewer.myCharacter
  );
  const selectedCharacter = useSelector(
    (state: State) => state.partyViewer.selectedCharacter
  );
  const partyCharacters: Character[] = useSelector(
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
    if (value === '') {
      alert('無効な値です。数値だけが入力できます');
      return;
    }
    const valueNum = parseInt(e.target.value, 10);
    const updateParam = {
      [paramType]: {
        ...myCharacter[paramType],
        current: valueNum,
      },
    };

    // Firestoreを更新
    firestore.collection('character').doc(myCharacter.name).update(updateParam);
  };

  useEffect(() => {
    const characterQueryCollection = firestore
      .collection('character')
      .orderBy('name', 'asc');

    // Firestoreの変更を検知し, キャラクターリストを更新する
    characterQueryCollection.onSnapshot((querySnapshot) => {
      const addedCharacters: Character[] = [];
      querySnapshot.docChanges().forEach((change) => {
        // キャラクターデータが追加されたとき (※アプリ起動時にも発火する)
        if (change.type === 'added') {
          // ここでFirestoreから受け取る値はCharacter型のはずなので、キャストしている
          const rawData = change.doc.data() as Character;
          addedCharacters.push(rawData);
        }
      });
      const savedCharacters = [...addedCharacters];
      dispatch(getCharacters(savedCharacters));
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
                  <input
                    type="number"
                    min="0"
                    max={myCharacter.hp.max}
                    value={myCharacter.hp.current}
                    onChange={(e) => handleChangeCurrentParam(e, 'hp')}
                  />{' '}
                  / {myCharacter.hp.max}
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={myCharacter.mp.max}
                    value={myCharacter.mp.current}
                    onChange={(e) => handleChangeCurrentParam(e, 'mp')}
                  />{' '}
                  / {myCharacter.mp.max}
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={myCharacter.san.max}
                    value={myCharacter.san.current}
                    onChange={(e) => handleChangeCurrentParam(e, 'san')}
                  />{' '}
                  / {myCharacter.san.max}
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
