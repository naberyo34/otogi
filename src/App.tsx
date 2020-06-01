import React, { useState } from 'react';
import './App.css';
import diceRoll from './services/diceRoll';

const App: React.FC = () => {
  const [dice, setDice] = useState(0);
  const handleClick = () => {
    const result = diceRoll();
    setDice(result);
  };
  return (
    <div className="App">
      <h1>otogi ver0.01</h1>
      <p>ダイスロール</p>
      <button type="button" onClick={handleClick}>
        する
      </button>
      <p className="result">{dice}</p>
    </div>
  );
};

export default App;
