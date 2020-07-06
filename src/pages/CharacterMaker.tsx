import React, { useEffect } from 'react';
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

  // Storeの初期化
  const initialize = () => {
    dispatch(changeEditCharacter(''));
    dispatch(setCharacterAllParams(initialCharacter));
  };

  // 名前欄に入力した内容をStoreに反映
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
      alert('FATAL ERR: 編集対象キャラクターが見つかりません');
      return;
    }

    // 対象キャラクターの能力値をロードし、Storeに反映
    dispatch(setCharacterAllParams(targetCharacter));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!makingCharacter.name) {
      alert('キャラクターの名前が入力されていません');
      return;
    }

    // 新規作成時は計算が必要な能力値をすべて算出し, Firestoreに新規データを追加
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

      // actionを発行し、Saga経由でFirestoreに追加
      dispatch(addCharacter.start(submitCharacter));
    }

    // 既存キャラクター編集の場合は、そのままmakingCharacterをFirestoreに反映
    dispatch(addCharacter.start(makingCharacter));
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line
  }, []);

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <select onChange={(e) => handleChangeEditCharacter(e)}>
        <option value="">新規作成</option>
        {characters.map((character) => (
          <option
            key={`$editCharacter-${character.name}`}
            value={character.name}
          >
            {character.name}
          </option>
        ))}
      </select>
      {!editCharacter && (
        <>
          <input
            type="text"
            placeholder="五味 葛男"
            onChange={(e) => handleMakingCharacterName(e)}
            value={makingCharacter.name}
          />
          <InputCharacterParams />
        </>
      )}
      <InputCharacterSkills />
      <input type="submit" value={editCharacter ? '更新する!' : '作成する!'} />
    </form>
  );
};

export default CharacterMaker;
