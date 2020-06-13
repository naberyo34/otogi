import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from '../services/firebase';
import Sound from '../components/Sound';
import diceRoll, { DiceResult, HiddenDiceResult } from '../services/diceRoll';
import formatDate from '../services/formatDate';
import { State } from '../modules/index';
import toggleLog from '../modules/realTimeDice/actions';

interface Result {
  playerName: string;
  dice: DiceResult | HiddenDiceResult;
  success?: string;
  timestamp: string;
}

interface StyledProps {
  isShow: boolean;
  emphasis?: boolean;
}

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
`;

const Inner = styled.div`
  width: 320px;
  padding: 16px;
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
  font-size: 10rem;
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
  width: 320px;
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

const Success = styled.p<StyledProps>`
  font-size: 3rem;
  color: ${(props) => (props.emphasis ? 'red' : 'black')};
  visibility: ${(props) => (props.isShow ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isShow ? '1' : '0')};
`;

const RealTimeDice: React.FC = () => {
  const dispatch = useDispatch();
  const [rollingGlobal, setRollingGlobal] = useState<boolean>(false);
  const [rollingLocal, setRollingLocal] = useState<boolean>(false);
  // const [showLog, setshowLog] = useState<boolean>(false);
  const showLog = useSelector((state: State) => state.realTimeDice.log.isShow);
  const [myName, setMyName] = useState<string>('');
  const [diceCount, setDiceCount] = useState({ value: '1' });
  const [diceSize, setDiceSize] = useState({ value: '100' });
  const [successNum, setSuccessNum] = useState<number>(0);
  // TODO: firebaseのDocumentData型とResult型を併用する方法が不明 気に入らない
  const [currentResult, setCurrentResult] = useState<
    firebase.firestore.DocumentData
  >({
    playerName: '',
    dice: {
      type: '',
      single: [],
      last: 0,
    },
    timestamp: '',
  });
  const [localResult, setLocalResult] = useState<Result | false>(false);
  const [resultLog, setResultLog] = useState<firebase.firestore.DocumentData>(
    []
  );

  // ダイス結果を生成
  const makeResult = (): Result => {
    const dice = diceRoll(Number(diceCount.value), Number(diceSize.value));
    const currentDate = formatDate(new Date());

    // 成功判定値が0 (未定義) の場合、判定は入れずに結果を返す
    if (successNum === 0) {
      const newResult: Result = {
        playerName: myName,
        dice,
        timestamp: currentDate,
      };

      return newResult;
    }

    // 成功判定値が設定されている場合、判定を入れて結果を返す
    let success = dice.last < successNum ? '成功' : '失敗';

    // もしクリティカルかファンブルが出ているなら、その結果を返す
    if (dice.type === '1D100' && dice.last <= 5) success = 'クリティカル';
    if (dice.type === '1D100' && dice.last >= 96) success = 'ファンブル';

    const newResult: Result = {
      playerName: myName,
      dice,
      success,
      timestamp: currentDate,
    };

    return newResult;
  };

  // ダイス演出
  const dicePerformance = (rollType: 'global' | 'hiding' | 'local') => {
    // rollTypeに応じて待ちを発生させる
    switch (rollType) {
      case 'global':
        setRollingGlobal(true);
        setTimeout(() => setRollingGlobal(false), 1000);
        break;
      case 'hiding':
        setRollingGlobal(true);
        setRollingLocal(true);
        setTimeout(() => setRollingGlobal(false), 1000);
        setTimeout(() => setRollingLocal(false), 1000);
        break;
      case 'local':
        setRollingLocal(true);
        setTimeout(() => setRollingLocal(false), 1000);
        break;
      default:
    }

    // サウンドを再生
    const sound: HTMLMediaElement | null = document.querySelector('#js-sound');
    if (sound) sound.play();
  };

  // ダイスの個数(回数)を設定
  const handleChooseDiceCount = (e: any) => {
    const count = e.target.value;
    setDiceCount({ value: count });
  };

  // ダイスの面数を設定
  const handleChooseDiceSize = (e: any) => {
    const size = e.target.value;
    setDiceSize({ value: size });
  };

  // 名前を設定
  const handleInputMyName = (e: any) => {
    const inputName = e.target.value;
    setMyName(inputName);
  };

  const handleInputSucessNum = (e: any) => {
    const inputValue: string = e.target.value;
    // 空欄にした場合は特に何もせずに終了する
    if (inputValue === '') return;

    const inputNum = parseInt(inputValue, 10);
    // バリデーション
    if (Number.isNaN(inputNum)) {
      alert('入力値が不正です。数値のみが入力できます');
      setSuccessNum(0);
      return;
    }

    setSuccessNum(inputNum);
  };

  // グローバルダイスロール
  const handleGlobalDiceRoll = () => {
    if (!myName) {
      alert('名前を入れてください');
      return;
    }

    const newResult = makeResult();
    const successNumDOM: HTMLInputElement | null = document.querySelector(
      '#js-successNum'
    );

    // 結果をfirestoreに追加
    firestore.collection('result').add(newResult);

    // 成功判定値欄を0に戻す
    setSuccessNum(0);
    if (successNumDOM) successNumDOM.value = '';
  };

  // 出目を伏せてダイスロール
  const handleHidingDiceRoll = () => {
    if (!myName) {
      alert('名前を入れてください');
      return;
    }

    const newResult = makeResult();
    const hiddenDiceResult: HiddenDiceResult = {
      type: '何か',
      single: '????',
      last: '????',
    };
    const hiddenResult: Result = {
      playerName: newResult.playerName,
      dice: hiddenDiceResult,
      success: '????',
      timestamp: newResult.timestamp,
    };
    const successNumDOM: HTMLInputElement | null = document.querySelector(
      '#js-successNum'
    );

    // 出目を隠してfirestoreに送信する
    firestore.collection('result').add(hiddenResult);

    // localResultにのみ結果を表示
    // TODO: いくらなんでもこのsetTimeoutはお粗末すぎる
    setTimeout(() => setLocalResult(newResult), 500);

    // 成功判定値欄を0に戻す
    setSuccessNum(0);
    if (successNumDOM) successNumDOM.value = '';
  };

  // ローカルダイスロール
  const handleLocalDiceRoll = () => {
    if (!myName) {
      alert('名前を入れてください');
      return;
    }

    const newResult = makeResult();
    const successNumDOM: HTMLInputElement | null = document.querySelector(
      '#js-successNum'
    );

    // ダイス演出
    dicePerformance('local');
    // localResultにのみ結果を表示
    setLocalResult(newResult);

    // 成功判定値欄を0に戻す
    setSuccessNum(0);
    if (successNumDOM) successNumDOM.value = '';
  };

  // ログの開閉
  const handleToggleLog = () => {
    dispatch(toggleLog());
  };

  useEffect(() => {
    // Firestoreの変更を検知し、DOMの状態を変更
    const queryCollection = firestore
      .collection('result')
      .orderBy('timestamp', 'asc');

    queryCollection.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newResult: firebase.firestore.DocumentData = change.doc.data();
          const log = resultLog;

          // ダイス演出
          if (newResult.dice.type === '何か') {
            dicePerformance('hiding');
          } else {
            dicePerformance('global');
          }

          // currentResultを最新の結果に更新
          setCurrentResult(newResult);
          // ログに最新の結果をunshift
          log.unshift(newResult);
          setResultLog(log);
        }
      });
    });
  }, []);

  return (
    <Wrapper>
      <Inner>
        <DiceSetting>
          <Select onChange={handleChooseDiceCount}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </Select>
          <SelectLabel>D</SelectLabel>
          <Select onChange={handleChooseDiceSize}>
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
          <label htmlFor="myName">
            あなたの名前:
            <input
              id="myName"
              type="text"
              onChange={(e) => handleInputMyName(e)}
            />
          </label>
        </InputArea>
        <InputArea>
          <label htmlFor="js-successNum">
            成功判定値(1 〜 99):
            <input
              id="js-successNum"
              type="tel"
              maxLength={2}
              onChange={(e) => handleInputSucessNum(e)}
            />
          </label>
        </InputArea>
        <p>
          未入力の場合は特に判定しません。1度ダイスを振ると未入力に戻ります。
        </p>
        <DiceRoll>
          <button
            type="button"
            onClick={handleGlobalDiceRoll}
            disabled={rollingGlobal || rollingLocal}
          >
            ダイスロール!
          </button>
          <p>↓振ったことは伝えますが、出目は自分以外に見えません</p>
          <button
            type="button"
            onClick={handleHidingDiceRoll}
            disabled={rollingGlobal || rollingLocal}
          >
            出目を伏せてダイスロール!
          </button>
          <p>↓振ったことは自分にしかわかりません (ログも残りません)</p>
          <button
            type="button"
            onClick={handleLocalDiceRoll}
            disabled={rollingGlobal || rollingLocal}
          >
            こっそりダイスロール!
          </button>
        </DiceRoll>
        <ResultDisplay>
          <Info>
            {currentResult.playerName} さんが {currentResult.dice.type}{' '}
            を振りました:
          </Info>
          <SingleDisplay isShow={!rollingGlobal}>
            {Array.isArray(currentResult.dice.single) ? (
              currentResult.dice.single.map((single: number | string) => (
                <span>{single}</span>
              ))
            ) : (
              <span>{currentResult.dice.single}</span>
            )}
          </SingleDisplay>
          <CurrentDisplay isShow={!rollingGlobal}>
            {currentResult.dice.last}
          </CurrentDisplay>
          {currentResult.success && (
            <Success
              isShow={!rollingGlobal}
              emphasis={
                currentResult.success === 'クリティカル' ||
                currentResult.success === 'ファンブル'
              }
            >
              判定: {currentResult.success}
            </Success>
          )}
        </ResultDisplay>
        {localResult && (
          <LocalResultDisplay>
            <Info>
              {localResult.playerName} さんが 非公開で {localResult.dice.type}{' '}
              を振りました:
            </Info>
            <SingleDisplay isShow={!rollingLocal}>
              {Array.isArray(localResult.dice.single) ? (
                localResult.dice.single.map((single: number | string) => (
                  <span>{single}</span>
                ))
              ) : (
                <span>{localResult.dice.single}</span>
              )}
            </SingleDisplay>
            <CurrentDisplay isShow={!rollingLocal}>
              {localResult.dice.last}
            </CurrentDisplay>
            {localResult.success && (
              <Success isShow={!rollingLocal}>
                判定: {localResult.success}
              </Success>
            )}
          </LocalResultDisplay>
        )}
        <Sound />
      </Inner>
      <LogSwitch isShow={showLog} type="button" onClick={handleToggleLog}>
        ログ
      </LogSwitch>
      <LogWrapper isShow={showLog}>
        <LogInner>
          {resultLog.map((log: Result) => (
            <p key={log.timestamp}>
              [{log.timestamp}]<br />
              <PlayerName>{log.playerName}</PlayerName> さんが {log.dice.type}{' '}
              で {log.dice.last} を出しました。
              {log.success && log.success !== '????' && `${log.success}です。`}
            </p>
          ))}
        </LogInner>
      </LogWrapper>
    </Wrapper>
  );
};

export default RealTimeDice;
