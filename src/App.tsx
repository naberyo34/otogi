import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import RealTimeDice from './pages/RealTimeDice';
import CharacterMaker from './pages/CharacterMaker';

const App: React.FC = () => (
  <BrowserRouter>
    <p>otogi v0.3alpha 完全に開発中なので色々おかしいです</p>
    <ul>
      <li>
        <Link to="/realtime-dice">リアルタイムダイス</Link>
        <Link to="/character-maker">キャラクターメーカー</Link>
      </li>
    </ul>
    <Route path="/realtime-dice" component={RealTimeDice} />
    <Route path="/character-maker" component={CharacterMaker} />
  </BrowserRouter>
);

export default App;
