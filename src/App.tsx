import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import SessionRoom from './pages/SessionRoom';
import CharacterMaker from './pages/CharacterMaker';

const App: React.FC = () => (
  <BrowserRouter>
    <p>otogi v0.4</p>
    <ul>
      <li>
        <Link to="/session-room">セッションルーム</Link>
      </li>
      <li>
        <Link to="/character-maker">キャラクターメーカー (beta)</Link>
      </li>
    </ul>
    <Route path="/session-room" component={SessionRoom} />
    <Route path="/character-maker" component={CharacterMaker} />
  </BrowserRouter>
);

export default App;
