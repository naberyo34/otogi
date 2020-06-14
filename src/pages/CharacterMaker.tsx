import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from '../services/firebase';
import { editCharacterStatus } from '../modules/characterMaker/actions';
import { State } from '../modules/index';
import InputCharacterParams from '../components/characterMaker/InputCharacterParams';

const Wrapper = styled.section`
  margin-top: 32px;
  font-size: 1.6rem;
`;

const StatusArea = styled.textarea``;

const CharacterMaker: React.FC = () => {
  const dispatch = useDispatch();
  const newCharacter = useSelector((state: State) => state.characterMaker);
  // テキストエリアに入力した内容をStoreにも反映
  const handleEditStatus = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(editCharacterStatus(e.target.value));
  };
  // Storeの情報をFirestoreに送信する
  const handleSubmit = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();
    // キャラクターをfirestoreに追加
    firestore
      .collection('character')
      .add(newCharacter)
      .then(() => {
        alert('送信に成功しました');
      });
  };

  return (
    <Wrapper>
      <h2>キャラクターメーカー (alpha ver.)</h2>
      <p>
        RTDのキャラクター表示機能テスト用のため、現状実用性はありません。
        <br />
        ※ここで入力するのは『初期能力値』です。増減等は別に編集機能を設ける予定。
      </p>
      <p>現状旧ルール仕様のみ対応</p>
      <form>
        <label htmlFor="characterName">
          プレイヤー名:
          <input id="characterName" type="text" placeholder="五味 葛男" />
        </label>
        <InputCharacterParams />
        <span>ステータス:</span>
        <StatusArea
          id="status"
          cols={100}
          rows={4}
          placeholder="自由記述"
          onChange={(e) => handleEditStatus(e)}
        />
        <input type="submit" value="作成!" onClick={(e) => handleSubmit(e)} />
      </form>
    </Wrapper>
  );
};

export default CharacterMaker;
