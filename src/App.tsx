import React, { useState, useEffect } from 'react';
import { firestore } from './services/firebase';
import './App.css';
import diceRoll from './services/diceRoll';

interface displayResult {
  playerName: string;
  dice: {
    single: number[];
    last: number;
  };
}

const App: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [displayResult, setDisplayResult] = useState<displayResult>({
    playerName: '',
    dice: {
      single: [],
      last: 0,
    },
  });

  // 名前を設定
  const handleInputPlayerName = (e: any) => {
    const inputName = e.target.value;
    setPlayerName(inputName);
  };

  // ダイスロールボタン
  const handleDiceRoll = () => {
    if (!playerName) {
      alert('名前を入れてくれ');
      return;
    }

    const dice = diceRoll(3, 6);
    firestore.collection('dice').add({
      result: { playerName, dice },
    });
  };

  useEffect(() => {
    const queryCollection = firestore.collection('dice');
    queryCollection.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const current = change.doc.data();
          setDisplayResult(current.result);
        }
      });
    });
  }, []);

  return (
    <div className="App">
      <h1>otogi ver0.01</h1>
      <select>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <span>D</span>
      <select>
        <option value="100">100</option>
        <option value="10">10</option>
        <option value="6">6</option>
        <option value="4">4</option>
        <option value="3">3</option>
      </select>
      <label>
        あなたの名前:
        <input type="text" onChange={(e) => handleInputPlayerName(e)} />
      </label>
      <p>ダイスロール</p>
      <button type="button" onClick={handleDiceRoll}>
        する
      </button>
      <div>{displayResult.playerName}さんのダイスロール結果: </div>
      <div className="singleResult">
        {displayResult.dice.single.map((single) => (
          <p className="singleResult__num">{single}</p>
        ))}
      </div>
      <p className="result">{displayResult.dice.last}</p>
    </div>
  );
};

export default App;
