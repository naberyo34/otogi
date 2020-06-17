import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from '../services/firebase';
import {
  setCharacterName,
  setCharacterSkill,
} from '../modules/characterMaker/actions';
import { State } from '../modules/index';
import InputCharacterParams from '../components/characterMaker/InputCharacterParams';

const Wrapper = styled.section`
  padding: 16px;
  font-size: 1.6rem;
`;

const CharacterMaker: React.FC = () => {
  const dispatch = useDispatch();
  const newCharacter = useSelector(
    (state: State) => state.characterMaker.character
  );

  // 名前欄に入力した内容をStoreにも反映
  const handleEditName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(setCharacterName(value));
  };

  /**
   * 技能欄に入力した内容をStoreにも反映
   * @param e イベント
   * @param skillType オブジェクトキーに使うスキルの名称 (ex: 'combat'など)
   */
  const handleEditSkill = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    skillType: 'combat' | 'explore' | 'behavior' | 'negotation' | 'knowledge'
  ) => {
    const { value } = e.target;
    const newSkill = {
      [skillType]: value,
    };

    dispatch(setCharacterSkill(newSkill));
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
    const mp = {
      max: newCharacter.pow,
      current: newCharacter.pow,
    };
    const san = {
      max: newCharacter.pow * 5,
      current: newCharacter.pow * 5,
      madness: newCharacter.pow * 4,
    };
    // TODO: 何もluckとかまでStoreに入れ直す必要はないことに気づいた
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
      .doc(submitCharacter.name)
      .set(submitCharacter)
      .then(() => {
        alert('送信に成功しました');
      });
  };

  return (
    <Wrapper>
      <h2>キャラクターメーカー (beta ver.)</h2>
      <p>※いまのところクトゥルフ神話TRPG 旧ルールフォーマットのみ対応</p>
      <p>
        開発中のため、他サービスで作成済のキャラクターを投入するしかできません。
        <br />
        また、技能パラメータはテキストコピペ形式になっています(改良予定)。
      </p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <span>プレイヤー名:</span>
        <input
          type="text"
          placeholder="五味 葛男"
          onChange={(e) => handleEditName(e)}
        />
        <InputCharacterParams />
        <span>ステータス:</span>
        <textarea
          placeholder="戦闘系技能をコピペしてください"
          onChange={(e) => handleEditSkill(e, 'combat')}
        />
        <textarea
          data-skill="explore"
          placeholder="探索系技能をコピペしてください"
          onChange={(e) => handleEditSkill(e, 'explore')}
        />
        <textarea
          data-skill="behavior"
          placeholder="行動系技能をコピペしてください"
          onChange={(e) => handleEditSkill(e, 'behavior')}
        />
        <textarea
          data-skill="negotiation"
          placeholder="交渉系技能をコピペしてください"
          onChange={(e) => handleEditSkill(e, 'negotation')}
        />
        <textarea
          data-skill="knowledge"
          placeholder="知識系技能をコピペしてください"
          onChange={(e) => handleEditSkill(e, 'knowledge')}
        />
        <input type="submit" value="作成!" />
      </form>
    </Wrapper>
  );
};

export default CharacterMaker;
