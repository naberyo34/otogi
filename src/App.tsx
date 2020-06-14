import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import RealTimeDice from './pages/RealTimeDice';
import CharacterMaker from './pages/CharacterMaker';

const App: React.FC = () => (
  <BrowserRouter>
    <p>otogi v0.35</p>
    <ul>
      <li>
        <Link to="/realtime-dice">リアルタイムダイス</Link>
      </li>
      <li>
        <Link to="/character-maker">キャラクターメーカー(alpha)</Link>
      </li>
    </ul>
    <Route path="/realtime-dice" component={RealTimeDice} />
    <Route path="/character-maker" component={CharacterMaker} />
  </BrowserRouter>
);

export default App;
