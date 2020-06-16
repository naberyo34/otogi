import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { firestore } from '../../services/firebase';

const Wrapper = styled.section`
  width: calc(100vw - 320px);
  padding: 16px;
`;

const StatusCard = styled.div`
  margin-top: 16px;
  background: aliceblue;

  p {
    font-size: 1.6rem;
  }
`;

const PartyViewer: React.FC = () => {
  // TODO: 以下はCharacterPreview関連のStateです 切り分けろ
  const [myCharacter, setMyCharacter] = useState<any>({});
  const [characters, setCharacters] = useState<firebase.firestore.DocumentData>(
    []
  );
  const [choosedViewCharacter, setChoosedViewCharacter] = useState<string>('');
  const [viewCharacters, setViewCharacters] = useState<any[]>([]);

  // 選択したキャラクターを使うよう設定
  const handleChoosedMyCharacter = (e: any) => {
    const choosedCharacterName = e.target.value;
    const choosedCharacter = characters.find(
      (character: any) => character.name === choosedCharacterName
    );

    // 検索に失敗した場合はStateを初期化して返す
    // (ex: セレクトボックスを'選択してください'に戻したときなど)
    if (!choosedCharacter) {
      setMyCharacter([]);
      return;
    }

    setMyCharacter(choosedCharacter);
  };

  const handleChooseAddList = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const target = characters.find(
      (character: any) => value === character.name
    );
    setChoosedViewCharacter(target);
  };

  const handleAddList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentViewCharacters = viewCharacters;
    currentViewCharacters.push(choosedViewCharacter);
    setViewCharacters(currentViewCharacters);
  };

  useEffect(() => {
    // Firestoreの変更を検知し、DOMの状態を変更 (キャラクタープレビュー)
    // TODO: コンポーネント切り分けろ
    const characterQueryCollection = firestore
      .collection('character')
      .orderBy('name', 'asc');

    characterQueryCollection.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        // Firestoreにデータが追加されたとき (※アプリ起動時にも発火する)
        if (change.type === 'added') {
          const rawData: firebase.firestore.DocumentData = change.doc.data();
          const currentCharacters = characters;

          // currentCharactersに最新の結果をpushしてstateを更新
          currentCharacters.push(rawData);
          setCharacters(currentCharacters);
        }
      });
    });
    // TODO: useEffectは一回発火すれば十分なので今の所こう書いてる
    // eslint-disable-next-line
  }, []);

  return (
    <Wrapper>
      <p>ステータス一覧</p>
      {myCharacter && (
        <>
          <StatusCard>
            <p>自分のキャラクター</p>
            <p>{myCharacter.name}</p>
            <p>{myCharacter.status}</p>
          </StatusCard>
          {viewCharacters.map((viewCharacter) => (
            <StatusCard key={viewCharacter.name}>
              <p>{viewCharacter.name}</p>
              <p>{viewCharacter.status}</p>
            </StatusCard>
          ))}
          <form onSubmit={(e) => handleAddList(e)}>
            <select id="viewChara" onChange={(e) => handleChooseAddList(e)}>
              <option value="">選択してください</option>
              {characters.map((character: any) => (
                <option
                  key={`viewChara-${character.name}`}
                  value={character.name}
                >
                  {character.name}
                </option>
              ))}
            </select>
            <input type="submit" value="リストに追加" />
          </form>
        </>
      )}
    </Wrapper>
  );
};

export default PartyViewer;
