import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import SessionRoom from './pages/SessionRoom';
import CharacterMaker from './pages/CharacterMaker';

const MainMenu = styled.section`
  padding: 16px;
`;

const App: React.FC = () => (
  <BrowserRouter>
    <MainMenu>
      <p>otogi v0.4</p>
      <ul>
        <li>
          <Link to="/session-room">セッションルーム</Link>
        </li>
        <li>
          <Link to="/character-maker">キャラクターメーカー (beta)</Link>
        </li>
      </ul>
    </MainMenu>
    <Route path="/session-room" component={SessionRoom} />
    <Route path="/character-maker" component={CharacterMaker} />
  </BrowserRouter>
);

export default App;
