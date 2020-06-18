import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from '../services/firebase';
import { setCharacterName } from '../modules/characterMaker/actions';
import { State } from '../modules/index';
import InputCharacterParams from '../components/characterMaker/InputCharacterParams';
import InputCharacterSkills from '../components/characterMaker/InputCharacterSkills';

const Wrapper = styled.section`
  width: 100vw;
  padding: 16px;
`;

const Title = styled.h2`
  font-size: 1.6rem;
`;

const PlayerName = styled.h3`
  margin-top: 16px;
  font-size: 1.6rem;
`;

const Submit = styled.input`
  width: 100%;
  padding: 4px;
  margin-top: 16px;
  color: white;
  background: red;
  border: none;
  border-radius: 4px;
`;

const CharacterMaker: React.FC = () => {
  const dispatch = useDispatch();
  const newCharacter = useSelector(
    (state: State) => state.characterMaker.character
  );

  // 名前欄に入力した内容をStoreにも反映
  const handleEditName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newName = {
      name: value,
    };
    dispatch(setCharacterName(newName));
  };

  // 計算が必要な能力値をすべて算出し, Firestoreに格納
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newCharacter.name) {
      alert('キャラクターの名前が入力されていません');
      return;
    }

    const hp = Math.floor(
      (newCharacter.foundationParams.con + newCharacter.foundationParams.siz) /
        2
    );
    const mp = newCharacter.foundationParams.pow;
    const san = newCharacter.foundationParams.pow * 5;
    const submitCharacter = {
      ...newCharacter,
      hp,
      mp,
      san,
    };

    // キャラクターをfirestoreに追加
    firestore
      .collection('character')
      .doc(submitCharacter.name)
      .set(submitCharacter)
      .then(() => {
        alert('送信に成功しました');
      });
  };

  return (
    <Wrapper>
      <Title>キャラクターメーカー (beta ver.)</Title>
      <p>※いまのところクトゥルフ神話TRPG 旧ルールフォーマットのみ対応</p>
      <p>
        開発中のため、他サービスで作成済のキャラクターを投入して使ってください。
      </p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <PlayerName>プレイヤー名(変更不可)</PlayerName>
        <input
          type="text"
          placeholder="五味 葛男"
          onChange={(e) => handleEditName(e)}
        />
        <InputCharacterParams />
        <InputCharacterSkills />
        <Submit type="submit" value="作成!" />
      </form>
    </Wrapper>
  );
};

export default CharacterMaker;
