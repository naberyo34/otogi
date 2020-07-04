import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import SessionRoom from 'pages/SessionRoom';
import CharacterMaker from 'pages/CharacterMaker';

const Main = styled.main`
  padding: 16px;
`;

const App: React.FC = () => (
  <BrowserRouter>
    <Main>
      <Route exact path="/">
        <p>otogi v0.5 (alpha)</p>
        <Link to="/session-room">セッションルーム</Link>
        <br />
        <Link to="/character-maker">キャラクターメーカー</Link>
      </Route>
      <Route path="/session-room" component={SessionRoom} />
      <Route path="/character-maker" component={CharacterMaker} />
    </Main>
  </BrowserRouter>
);

export default App;
