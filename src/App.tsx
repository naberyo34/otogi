import React, { useState, useEffect } from 'react';
import { firestore } from './services/firebase';
import './App.css';
import diceRoll, { DiceResult } from './services/diceRoll';

interface Result {
  playerName: string;
  dice: DiceResult;
}

const App: React.FC = () => {
  const [myName, setMyName] = useState('');
  const [diceCount, setDiceCount] = useState({ value: '1' });
  const [diceSize, setDiceSize] = useState({ value: '100' });
  const [currentResult, setCurrentResult] = useState<Result>({
    playerName: '',
    dice: {
      type: '',
      single: [],
      last: 0,
    },
  });
  const [resultLog, setResultLog] = useState<Result[]>([]);

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
    firestore.collection('diceLog').add({
      result: {
        playerName: myName,
        dice,
      },
    });
  };

  // Firestoreの変更を検知し、DOMの状態を変更
  useEffect(() => {
    const queryCollection = firestore.collection('diceLog');
    queryCollection.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const addedData = change.doc.data();
          const log = resultLog;
          setCurrentResult(addedData.result);
          // ログに最新の結果をunshiftしてstateを更新
          log.unshift(addedData.result);
          setResultLog(log);
        }
      });
    });
  }, [resultLog]);

  return (
    <div className="App">
      <h1>otogi ver0.01</h1>
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
      <button type="button" onClick={handleDiceRoll}>
        ダイスロール!
      </button>
      <div>
        {currentResult.playerName}さんが{currentResult.dice.type}を振りました:{' '}
      </div>
      <div className="singleResult">
        {currentResult.dice.single.map((single) => (
          <p className="singleResult__num">{single}</p>
        ))}
      </div>
      <p className="result">{currentResult.dice.last}</p>
      <div className="log">
        <p>ログ: </p>
        {resultLog.map((log) => (
          <p>
            {log.playerName}さんが{log.dice.type}で{log.dice.last}を出しました。
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
