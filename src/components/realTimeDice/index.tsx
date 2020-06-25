import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from 'services/firebase';
import diceRoll from 'services/diceRoll';
import formatDate from 'services/formatDate';
import generateRandomId from 'services/generateRandomId';
import { State } from 'modules/index';
import {
  setDiceCount,
  setDiceSize,
  setJudgementNumber,
  setRollingType,
  setGlobalResult,
  setLocalResult,
  toggleDiceLog,
} from 'modules/realTimeDice/actions';
import { Result, HiddenDice } from 'interfaces/dice';
import Sound from 'components/realTimeDice/Sound';

interface StyledProps {
  isShow?: boolean;
  isEmphasize?: boolean;
}

const Wrapper = styled.section`
  width: 320px;
  height: 90vh;
  padding: 16px;
  overflow-y: scroll;
  border-right: 1px solid black;
`;

const DiceSetting = styled.div`
  margin-top: 16px;
  text-align: center;
`;

const Select = styled.select`
  font-size: 2.4rem;
`;

const SelectLabel = styled.span`
  padding: 0 8px;
  font-size: 2.4rem;
`;

const InputArea = styled.div`
  margin-top: 16px;
  text-align: center;

  label {
    font-size: 1.6rem;
  }
`;

const DiceRoll = styled.div`
  margin-top: 16px;
  text-align: center;

  p {
    :nth-of-type(1) {
      margin-top: 32px;
    }
  }

  button {
    width: 100%;
    padding: 8px;
    color: white;
    cursor: pointer;
    background: black;
    border-radius: 8px;

    &:disabled {
      cursor: wait;
      opacity: 0.2;
    }

    &:first-child {
      background: red;
    }
  }
`;

const Info = styled.p`
  font-size: 1.6rem;
`;

const ResultDisplay = styled.div`
  padding: 8px;
  margin-top: 32px;
  text-align: center;
`;

const LocalResultDisplay = styled.div`
  padding: 8px;
  margin-top: 32px;
  color: white;
  text-align: center;
  background: black;
  border-radius: 8px;
`;

const SingleDisplay = styled.div<StyledProps>`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  visibility: ${(props) => (props.isShow ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isShow ? '1' : '0')};
  transition: opacity 0.2s;

  span {
    font-size: 1.6rem;
    &:not(:first-child) {
      margin-left: 8px;
    }
  }
`;

const CurrentDisplay = styled.span<StyledProps>`
  display: inline-block;
  margin-top: 16px;
  font-size: 8rem;
  visibility: ${(props) => (props.isShow ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isShow ? '1' : '0')};
  transition: opacity 0.2s;
`;

const LogSwitch = styled.button<StyledProps>`
  position: fixed;
  bottom: ${(props) => (props.isShow ? '320px' : '0')};
  left: 0;
  padding: 8px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  transition: bottom 0.2s;
`;

const LogWrapper = styled.div<StyledProps>`
  position: fixed;
  bottom: ${(props) => (props.isShow ? '0' : '-320px')};
  left: 0;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 320px;
  background: rgba(0, 0, 0, 0.6);
  transition: bottom 0.2s;
`;

const LogInner = styled.div`
  padding: 16px;
  overflow-y: scroll;
  font-size: 1.6rem;
  color: white;

  p {
    margin-top: 1em;
  }
`;

const PlayerName = styled.span`
  font-weight: bold;
  color: red;
`;

const Judgement = styled.p<StyledProps>`
  font-size: 2.4rem;
  color: ${(props) => (props.isEmphasize ? 'red' : 'inherit')};
  visibility: ${(props) => (props.isShow ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isShow ? '1' : '0')};
`;

const RealTimeDice: React.FC = () => {
  const dispatch = useDispatch();
  const myCharacter = useSelector(
    (state: State) => state.partyViewer.myCharacter
  );
  const {
    diceCount,
    diceSize,
    judgementNumber,
    rollingType,
    globalResult,
    localResult,
    diceLog,
  } = useSelector((state: State) => state.realTimeDice);

  /**
   * ダイス結果を生成
   * (TODO: stateを呼び出すので関数の切り出しをしていない)
   * @return newResult Result型。ダイス結果
   */
  const makeResult = (): Result => {
    const dice = diceRoll(diceCount, diceSize);
    const currentDate = formatDate(new Date());

    // 成功判定値が0 (未定義) の場合、判定は入れずに結果を返す
    if (judgementNumber === 0) {
      const newResult: Result = {
        playerName: myCharacter,
        dice,
        timestamp: currentDate,
      };

      return newResult;
    }

    // 成功判定値が設定されている場合、判定を入れて結果を返す
    let judgement = dice.last <= judgementNumber ? '成功' : '失敗';

    // もしクリティカルかファンブルが出ているなら、その結果を返す
    if (dice.type === '1D100' && dice.last <= 5) judgement = 'クリティカル';
    if (dice.type === '1D100' && dice.last >= 96) judgement = 'ファンブル';

    const newResult: Result = {
      playerName: myCharacter,
      dice,
      judgement,
      timestamp: currentDate,
    };

    return newResult;
  };

  /**
   * ダイス演出を行う
   * @param rollType ダイスロールのタイプ(グローバル、出目伏せ、ローカル)
   */
  const dicePerformance = (rollType: 'global' | 'hiding' | 'local') => {
    // rollTypeに応じて待ちを発生させる
    switch (rollType) {
      case 'global':
        dispatch(setRollingType('global'));
        setTimeout(() => dispatch(setRollingType(false)), 1000);
        break;
      case 'hiding':
        dispatch(setRollingType('hiding'));
        setTimeout(() => dispatch(setRollingType(false)), 1000);
        break;
      case 'local':
        dispatch(setRollingType('local'));
        setTimeout(() => dispatch(setRollingType(false)), 1000);
        break;
      default:
    }

    // サウンドを再生
    const sound: HTMLMediaElement | null = document.querySelector('#js-sound');
    if (sound) sound.play();
  };

  // ダイスの個数(回数)を設定
  const handleChooseDiceCount = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (!value) return;
    const valueInt = parseInt(value, 10);

    dispatch(setDiceCount(valueInt));
  };

  // ダイスの面数を設定
  const handleChooseDiceSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (!value) return;

    const valueInt = parseInt(value, 10);
    dispatch(setDiceSize(valueInt));
  };

  // 成功判定値を設定
  const handleInputSucessNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) return;

    const judgementNumberDOM: HTMLInputElement | null = document.querySelector(
      '#js-judgementNumber'
    );
    const valueInt = parseInt(value, 10);

    // 1未満、100以上の値は弾く
    if (valueInt < 1 || valueInt > 99) {
      if (judgementNumberDOM) judgementNumberDOM.value = '';
      dispatch(setJudgementNumber(0));
      alert('入力値が小さすぎるか大きすぎます。1 ~ 99 が入力できます');
      return;
    }

    dispatch(setJudgementNumber(valueInt));
  };

  /**
   * ダイスロール処理
   * @param rollType ダイスロールのタイプ(グローバル、出目伏せ、ローカル)
   */
  const handleDiceRoll = (rollType: 'global' | 'hiding' | 'local') => {
    if (!myCharacter) {
      alert('先にキャラクターを選択してください');
      return;
    }

    const newResult = makeResult();
    const judgementNumberDOM: HTMLInputElement | null = document.querySelector(
      '#js-judgementNumber'
    );
    // MEMO: hidingのときしか使わないが, switch内で変数宣言すると怒られる
    const hiddenDice: HiddenDice = {
      type: '何か',
      single: '????',
      last: '????',
    };
    const hiddenResult: Result = {
      playerName: newResult.playerName,
      dice: hiddenDice,
      judgement: '????',
      timestamp: newResult.timestamp,
    };

    switch (rollType) {
      // グローバルダイスロール(全体公開, 普通のロール)
      case 'global':
        firestore.collection('result').add(newResult);
        break;
      // 出目を伏せてダイスロール(振ったことは通知)
      case 'hiding':
        firestore.collection('result').add(hiddenResult);
        // localResultにのみ結果を表示
        dispatch(setLocalResult(newResult));
        break;
      // ローカルダイスロール(ブラウザ内で見れるのみ, Firestoreに送信しない)
      case 'local':
        dicePerformance('local');
        // localResultにのみ結果を表示
        dispatch(setLocalResult(newResult));
        break;
      default:
        break;
    }

    // 成功判定値欄を0に戻す
    if (judgementNumberDOM) judgementNumberDOM.value = '';
    dispatch(setJudgementNumber(0));
  };

  // ログの開閉
  const handleToggleLog = () => {
    dispatch(toggleDiceLog());
  };

  return (
    <Wrapper>
      <DiceSetting>
        <Select onChange={(e) => handleChooseDiceCount(e)}>
          {/* TODO: なんのためのJSだ 省略して書け */}
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </Select>
        <SelectLabel>D</SelectLabel>
        <Select onChange={(e) => handleChooseDiceSize(e)}>
          <option value="100">100</option>
          <option value="20">20</option>
          <option value="10">10</option>
          <option value="9">9</option>
          <option value="8">8</option>
          <option value="7">7</option>
          <option value="6">6</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
        </Select>
      </DiceSetting>
      <InputArea>
        <span>成功判定値(1 〜 99):</span>
        <input
          id="js-judgementNumber"
          type="number"
          min={1}
          max={99}
          onChange={(e) => handleInputSucessNum(e)}
        />
      </InputArea>
      <p>未入力の場合は特に判定しません。1度ダイスを振ると未入力に戻ります。</p>
      <DiceRoll>
        <button
          type="button"
          onClick={() => handleDiceRoll('global')}
          disabled={Boolean(rollingType)}
        >
          ダイスロール!
        </button>
        <p>↓振ったことは伝えますが、出目は自分以外に見えません</p>
        <button
          type="button"
          onClick={() => handleDiceRoll('hiding')}
          disabled={Boolean(rollingType)}
        >
          出目を伏せてダイスロール!
        </button>
        <p>↓振ったことは自分にしかわかりません (ログも残りません)</p>
        <button
          type="button"
          onClick={() => handleDiceRoll('local')}
          disabled={Boolean(rollingType)}
        >
          こっそりダイスロール!
        </button>
      </DiceRoll>
      {globalResult && (
        <ResultDisplay>
          <Info>
            {globalResult.playerName} さんが {globalResult.dice.type}{' '}
            を振りました:
          </Info>
          <SingleDisplay isShow={rollingType !== ('global' || 'hiding')}>
            {Array.isArray(globalResult.dice.single) ? (
              globalResult.dice.single.map((single: number | string) => (
                <span key={generateRandomId(8)}>{single}</span>
              ))
            ) : (
              <span>{globalResult.dice.single}</span>
            )}
          </SingleDisplay>
          <CurrentDisplay isShow={rollingType !== ('global' || 'hiding')}>
            {globalResult.dice.last}
          </CurrentDisplay>
          {globalResult.judgement && (
            <Judgement
              isShow={rollingType !== ('global' || 'hiding')}
              isEmphasize={
                globalResult.judgement === 'クリティカル' ||
                globalResult.judgement === 'ファンブル'
              }
            >
              判定: {globalResult.judgement}
            </Judgement>
          )}
        </ResultDisplay>
      )}
      {localResult && (
        <LocalResultDisplay>
          <Info>
            {localResult.playerName} さんが 非公開で {localResult.dice.type}{' '}
            を振りました:
          </Info>
          <SingleDisplay isShow={rollingType !== ('local' || 'hiding')}>
            {Array.isArray(localResult.dice.single) ? (
              localResult.dice.single.map((single: number | string) => (
                <span key={generateRandomId(8)}>{single}</span>
              ))
            ) : (
              <span>{localResult.dice.single}</span>
            )}
          </SingleDisplay>
          <CurrentDisplay isShow={rollingType !== ('local' || 'hiding')}>
            {localResult.dice.last}
          </CurrentDisplay>
          {localResult.judgement && (
            <Judgement isShow={rollingType !== ('local' || 'hiding')}>
              判定: {localResult.judgement}
            </Judgement>
          )}
        </LocalResultDisplay>
      )}
      <Sound />
      <LogSwitch isShow={diceLog} type="button" onClick={handleToggleLog}>
        ログ
      </LogSwitch>
      {/* <LogWrapper isShow={diceLog}>
        <LogInner>
          {resultLog.map((log: Result) => (
            <p key={generateRandomId(8)}>
              [{log.timestamp}]<br />
              <PlayerName>{log.playerName}</PlayerName> さんが {log.dice.type}{' '}
              で {log.dice.last} を出しました。
              {log.judgement && log.judgement !== '????' && `${log.judgement}です。`}
            </p>
          ))}
        </LogInner>
      </LogWrapper> */}
    </Wrapper>
  );
};

export default RealTimeDice;
