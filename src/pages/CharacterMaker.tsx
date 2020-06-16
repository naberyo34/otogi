import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from '../services/firebase';
import { setCharacterText } from '../modules/characterMaker/actions';
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
  const handleEditText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const targetText = e.target.value;
    // MEMO: anyつけないと下記の'計算されたプロパティ名'が使えなくなる
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Object_initializer
    const targetLabel: any = e.target.getAttribute('data-js-label');
    const changeText = {
      [targetLabel]: targetText,
    };

    dispatch(setCharacterText(changeText));
  };
  // Storeの情報をFirestoreに送信する
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="characterName">
          プレイヤー名:
          <textarea
            data-js-label="name"
            id="characterName"
            placeholder="五味 葛男"
            onChange={(e) => handleEditText(e)}
          />
        </label>
        <InputCharacterParams />
        <span>ステータス:</span>
        <StatusArea
          data-js-label="status"
          cols={100}
          rows={4}
          placeholder="自由記述"
          onChange={(e) => handleEditText(e)}
        />
        <input type="submit" value="作成!" />
      </form>
    </Wrapper>
  );
};

export default CharacterMaker;
