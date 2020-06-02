import React, { useState, useEffect } from 'react';
import { firestore } from './services/firebase';
import './App.css';
import diceRoll, { DiceResult } from './services/diceRoll';
import formatDate from './services/formatDate';

interface Result {
  playerName: string;
  dice: DiceResult;
  timestamp: string;
}

const App: React.FC = () => {
  const [isRolling, setRolling] = useState<boolean | number>(false);
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
            '.js-sound'
          );
          sound?.play();
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
    <div className="App">
      <h1>otogi ver0.1</h1>
      <div>
        <span>ダイスの音量調整はここからどうぞ</span>
        <audio src="./diceroll.mp3" controls className="js-sound" />
      </div>
      <select onChange={handleChooseDiceCount}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <span>D</span>
      <select onChange={handleChooseDiceSize}>
        <option value="100">100</option>
        <option value="10">10</option>
        <option value="6">6</option>
        <option value="4">4</option>
        <option value="3">3</option>
      </select>
      <label>
        あなたの名前:
        <input type="text" onChange={(e) => handleInputMyName(e)} />
      </label>
      <button
        type="button"
        onClick={handleDiceRoll}
        disabled={Boolean(isRolling)}
      >
        ダイスロール!
      </button>
      <div>
        {currentResult.playerName} さんが {currentResult.dice.type}{' '}
        を振りました:{' '}
      </div>
      {!isRolling && (
        <div className="singleResult">
          {currentResult.dice.single.map((single: string) => (
            <p className="singleResult__num">{single}</p>
          ))}
        </div>
      )}
      {!isRolling && <p className="result">{currentResult.dice.last}</p>}
      <div className="log">
        <p>ログ: </p>
        {resultLog.map((log: Result) => (
          <p>
            [{log.timestamp}] {log.playerName} さんが {log.dice.type} で{' '}
            {log.dice.last} を出しました
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
