import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from '../../services/firebase';
import {
  getCharacters,
  setMyCharacter,
  selectPartyCharacter,
  setPartyCharacters,
} from '../../modules/partyViewer/actions';
import { State } from '../../modules/index';
import { initialCharacter } from '../../modules/characterMaker/reducers';

const Wrapper = styled.section`
  width: calc(100vw - 320px);
  padding: 16px;
`;

const StatusCard = styled.div`
  padding: 16px;
  margin-top: 16px;
  background: aliceblue;
  border-radius: 4px;

  p {
    font-size: 1.6rem;
  }
`;

const PartyViewer: React.FC = () => {
  const dispatch = useDispatch();
  const characters = useSelector(
    (state: State) => state.partyViewer.characters
  );
  const myCharacter = useSelector(
    (state: State) => state.partyViewer.myCharacter
  );
  const selectedCharacter = useSelector(
    (state: State) => state.partyViewer.selectedCharacter
  );
  const partyCharacters = useSelector(
    (state: State) => state.partyViewer.partyCharacters
  );
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
      {myCharacter && (
        <StatusCard>
          <p>自分のキャラクター</p>
          <p>{myCharacter.name}</p>
          <p>{myCharacter.status}</p>
        </StatusCard>
      )}
      {partyCharacters.map((partyCharacter) => (
        <StatusCard key={partyCharacter.name}>
          <p>{partyCharacter.name}</p>
          <p>{partyCharacter.status}</p>
        </StatusCard>
      ))}
    </Wrapper>
  );
};

export default PartyViewer;
