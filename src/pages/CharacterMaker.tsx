import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  changeCharacterName,
  changeEditCharacter,
  setCharacterAllParams,
} from 'modules/characterMaker/actions';
import { addCharacter } from 'modules/firebase/actions';
import { State } from 'modules';
import { initialCharacter } from 'modules/characterMaker/reducers';
import InputCharacterParams from 'components/characterMaker/InputCharacterParams';
import InputCharacterSkills from 'components/characterMaker/InputCharacterSkills';

const Wrapper = styled.section`
  width: 100vw;
  padding: 16px;
`;

const Title = styled.h2`
  font-size: 1.6rem;
`;

const SubTitle = styled.h3`
  font-size: 1.6rem;
`;

const SelectEdit = styled.select`
  margin-top: 16px;
  font-size: 1.6rem;
`;

const PlayerName = styled.p`
  margin-top: 16px;
  font-size: 1.6rem;
`;

const InputName = styled.input`
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
  const makingCharacter = useSelector(
    (state: State) => state.characterMaker.makingCharacter
  );
  const editCharacter = useSelector(
    (state: State) => state.characterMaker.editCharacter
  );
  const characters = useSelector(
    (state: State) => state.firebaseReducer.characters
  );

  // 名前欄に入力した内容をStoreにも反映
  const handleMakingCharacterName = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    dispatch(changeCharacterName(value));
  };

  // 編集キャラクターの変更
  const handleChangeEditCharacter = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    dispatch(changeEditCharacter(value));

    // 新規作成モードに戻したときは、初期値を再ロードしてreturnする
    if (!value) {
      dispatch(setCharacterAllParams(initialCharacter));
      return;
    }

    const targetCharacter = characters.find(
      (character) => character.name === value
    );

    if (!targetCharacter) {
      alert(
        '編集対象キャラクターが見つかりません。開発チームまでお問い合わせください'
      );
      return;
    }

    // 対象キャラクターの能力値をロードし、Storeに反映
    dispatch(setCharacterAllParams(targetCharacter));
  };

  // submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!makingCharacter.name) {
      alert('キャラクターの名前が入力されていません');
      return;
    }

    // 新規作成
    // 計算が必要な能力値をすべて算出し, Firestoreに新規データを追加
    if (!editCharacter) {
      const hp = Math.round(
        (makingCharacter.foundationParams.con +
          makingCharacter.foundationParams.siz) /
          2
      );
      const mp = makingCharacter.foundationParams.pow;
      const san = makingCharacter.foundationParams.pow * 5;
      const submitCharacter = {
        ...makingCharacter,
        hp,
        mp,
        san,
      };

      // actionを発行し、SagaでFirestoreに追加
      dispatch(addCharacter.start(submitCharacter));
      return;
    }

    // 既存キャラクターの場合は、そのままmakingCharacterをFirestoreに反映
    dispatch(addCharacter.start(makingCharacter));
  };

  return (
    <Wrapper>
      <Title>キャラクターメーカー (beta ver.)</Title>
      <p>※いまのところクトゥルフ神話TRPG 旧ルールフォーマットのみ対応</p>
      <p>
        開発中のため、他サービスで作成済のキャラクターを投入して使ってください。
      </p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <SubTitle>
          {editCharacter
            ? 'キャラクターを編集する'
            : '新規キャラクターを作成する'}
        </SubTitle>
        <SelectEdit onChange={(e) => handleChangeEditCharacter(e)}>
          <option value="">新規作成</option>
          {characters.map((character) => (
            <option
              key={`$editCharacter-${character.name}`}
              value={character.name}
            >
              {character.name}
            </option>
          ))}
        </SelectEdit>
        {!editCharacter && (
          <>
            <PlayerName>プレイヤー名(変更不可)</PlayerName>
            <InputName
              type="text"
              placeholder="五味 葛男"
              onChange={(e) => handleMakingCharacterName(e)}
              value={makingCharacter.name}
            />
          </>
        )}
        <InputCharacterParams />
        <InputCharacterSkills />
        <Submit
          type="submit"
          value={editCharacter ? '更新する!' : '作成する!'}
        />
      </form>
    </Wrapper>
  );
};

export default CharacterMaker;
