import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from '../services/firebase';
import Sound from '../components/Sound';
import diceRoll, { DiceResult } from '../services/diceRoll';
import formatDate from '../services/formatDate';
import { State } from '../modules/index';
import toggleLog from '../modules/realTimeDice/actions';

interface Result {
  playerName: string;
  dice: DiceResult;
  timestamp: string;
}

interface StyledProps {
  isShow: boolean;
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

const NameSetting = styled.div`
  margin-top: 16px;
  text-align: center;
`;

const DiceRoll = styled.div`
  margin-top: 16px;
  text-align: center;

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
  margin-top: 32px;
  text-align: center;
`;

const LocalResultDisplay = styled.div`
  margin-top: 32px;
  color: white;
  text-align: center;
  background: black;
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
  bottom: ${(props) => (props.isShow ? '160px' : '0')};
  left: 0;
  padding: 8px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  transition: bottom 0.2s;
`;

const LogWrapper = styled.div<StyledProps>`
  position: fixed;
  bottom: ${(props) => (props.isShow ? '0' : '-160px')};
  left: 0;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 160px;
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

const RealTimeDice: React.FC = () => {
  const dispatch = useDispatch();
  const [isRolling, setRolling] = useState<boolean>(false);
  // const [showLog, setshowLog] = useState<boolean>(false);
  const showLog = useSelector((state: State) => state.realTimeDice.log.isShow);
  const [myName, setMyName] = useState('');
  const [diceCount, setDiceCount] = useState({ value: '1' });
  const [diceSize, setDiceSize] = useState({ value: '100' });
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

  // ダイスロールボタン
  const handleDiceRoll = () => {
    if (!myName) {
      alert('名前を入れてください');
      return;
    }

    const dice = diceRoll(Number(diceCount.value), Number(diceSize.value));
    const currentDate = formatDate(new Date());

    firestore.collection('result').add({
      playerName: myName,
      dice,
      timestamp: currentDate,
    });
  };

  const handleHiddenDiceRoll = () => {
    if (!myName) {
      alert('名前を入れてください');
      return;
    }

    const dice = diceRoll(Number(diceCount.value), Number(diceSize.value));
    const currentDate = formatDate(new Date());

    const addedData: Result = {
      playerName: myName,
      dice,
      timestamp: currentDate,
    };

    // firestoreには出目を隠して情報を送信する
    firestore.collection('result').add({
      playerName: myName,
      dice: {
        type: '何か',
        single: ['????'],
        last: '????',
      },
      timestamp: currentDate,
    });

    // currentResultを最新の結果に更新 (自分のstateのみ)
    setLocalResult(addedData);
  };

  const handleSilentDiceRoll = () => {
    if (!myName) {
      alert('名前を入れてください');
      return;
    }

    const dice = diceRoll(Number(diceCount.value), Number(diceSize.value));
    const currentDate = formatDate(new Date());

    const addedData: Result = {
      playerName: myName,
      dice,
      timestamp: currentDate,
    };

    // サウンドを再生
    const sound: HTMLMediaElement | null = document.querySelector('#js-sound');
    if (sound) sound.play();
    setTimeout(() => setRolling(false), 1000);

    // currentResultを最新の結果に更新 (自分のstateのみ)
    setLocalResult(addedData);
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
          /* MEMO: Firestoreがダイスロールの変更を検知したタイミングでダイスロール演出を発火させることで、
          リアルタイムに演出が再生される */
          setRolling(true);
          // サウンドを再生
          const sound: HTMLMediaElement | null = document.querySelector(
            '#js-sound'
          );
          if (sound) sound.play();
          setTimeout(() => setRolling(false), 1000);
          const addedData: firebase.firestore.DocumentData = change.doc.data();
          const log = resultLog;
          // currentResultを最新の結果に更新
          setCurrentResult(addedData);
          // ログに最新の結果をunshift
          log.unshift(addedData);
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
          </Select>
          <SelectLabel>D</SelectLabel>
          <Select onChange={handleChooseDiceSize}>
            <option value="100">100</option>
            <option value="10">10</option>
            <option value="6">6</option>
            <option value="4">4</option>
            <option value="3">3</option>
          </Select>
        </DiceSetting>
        <NameSetting>
          <label htmlFor="myName">
            あなたの名前:
            <input
              type="text"
              onChange={(e) => handleInputMyName(e)}
              id="myName"
            />
          </label>
        </NameSetting>
        <DiceRoll>
          <button type="button" onClick={handleDiceRoll} disabled={isRolling}>
            ダイスロール!
          </button>
          <p>↓振ったことは伝えますが、出目は自分以外に見えません</p>
          <button
            type="button"
            onClick={handleHiddenDiceRoll}
            disabled={isRolling}
          >
            出目を伏せてダイスロール!
          </button>
          <p>↓振ったことは自分にしかわかりません (ログも残りません)</p>
          <button
            type="button"
            onClick={handleSilentDiceRoll}
            disabled={isRolling}
          >
            こっそりダイスロール!
          </button>
        </DiceRoll>
        <ResultDisplay>
          <Info>
            {currentResult.playerName} さんが {currentResult.dice.type}{' '}
            を振りました:
          </Info>
          <SingleDisplay isShow={!isRolling}>
            {currentResult.dice.single.map((single: number) => (
              <span>{single}</span>
            ))}
          </SingleDisplay>
          <CurrentDisplay isShow={!isRolling}>
            {currentResult.dice.last}
          </CurrentDisplay>
        </ResultDisplay>
        {localResult && (
          <LocalResultDisplay>
            <Info>
              {localResult.playerName} さんが 非公開で {localResult.dice.type}{' '}
              を振りました:
            </Info>
            <SingleDisplay isShow={!isRolling}>
              {localResult.dice.single.map((single: number) => (
                <span>{single}</span>
              ))}
            </SingleDisplay>
            <CurrentDisplay isShow={!isRolling}>
              {localResult.dice.last}
            </CurrentDisplay>
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
              で {log.dice.last} を出しました
            </p>
          ))}
        </LogInner>
      </LogWrapper>
    </Wrapper>
  );
};

export default RealTimeDice;
