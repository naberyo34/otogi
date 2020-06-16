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

const CharacterMaker: React.FC = () => {
  const dispatch = useDispatch();
  const newCharacter = useSelector(
    (state: State) => state.characterMaker.character
  );
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
  // 計算が必要な能力値をすべて算出し, Firestoreに格納
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const luck = newCharacter.pow * 5;
    const idea = newCharacter.int * 5;
    const know = newCharacter.edu * 5;
    const hp = {
      max: Math.floor((newCharacter.con + newCharacter.siz) / 2),
      current: Math.floor((newCharacter.con + newCharacter.siz) / 2),
    };
    const mp = newCharacter.pow;
    const san = {
      max: newCharacter.pow * 5,
      current: newCharacter.pow * 5,
      madness: newCharacter.pow * 4,
    };
    // TODO: 何もluckとかまでStoreに入れ直す必要がないことに気づいた
    // Characterインターフェースとは別にStore用のインターフェースを用意したほうがよさそう
    const submitCharacter = {
      ...newCharacter,
      luck,
      idea,
      know,
      hp,
      mp,
      san,
    };

    // キャラクターをfirestoreに追加
    firestore
      .collection('character')
      .add(submitCharacter)
      .then(() => {
        alert('送信に成功しました');
      });
  };

  return (
    <Wrapper>
      <h2>キャラクターメーカー (beta ver.)</h2>
      <p>※いまのところクトゥルフ神話TRPG 旧ルールフォーマットのみ対応</p>
      <p>
        実装に時間食いそうなので、一旦よそで作ってパラメータブチ込む形とさせてくれ
      </p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <span>プレイヤー名:</span>
        <textarea
          data-js-label="name"
          placeholder="五味 葛男"
          onChange={(e) => handleEditText(e)}
        />
        <InputCharacterParams />
        <span>ステータス:</span>
        <textarea
          data-js-label="status"
          placeholder="自由記述"
          onChange={(e) => handleEditText(e)}
        />
        <input type="submit" value="作成!" />
      </form>
    </Wrapper>
  );
};

export default CharacterMaker;
