import React, { useState, useEffect } from 'react';
import { firestore } from './services/firebase';
import './App.css';
import diceRoll from './services/diceRoll';

const App: React.FC = () => {
  const [dice, setDice] = useState(0);
  const handleClick = () => {
    const result = diceRoll();
    firestore.collection('dice').add({
      result,
    });
  };

  useEffect(() => {
    const queryCollection = firestore.collection('dice');
    queryCollection.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const result = change.doc.data().result;
          setDice(result);
        }
      });
    });
  }, []);

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
