import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route } from 'react-router-dom';
import SessionRoom from 'pages/SessionRoom';
import CharacterMaker from 'pages/CharacterMaker';

const Main = styled.main`
  min-width: 960px;
  padding: 16px;
`;

const App: React.FC = () => (
  <BrowserRouter>
    <Main>
      <Route exact path="/">
        <p>
          otogi v0.5 (alpha) 緊急メンテナンス中
          <br />
          ご利用中のお客さまには大変ご迷惑をおかけしております。
          <br />
          ※session-roomにアクセスすれば諸々怪しいものの一応動きます
        </p>
      </Route>
      <Route path="/session-room" component={SessionRoom} />
      <Route path="/character-maker" component={CharacterMaker} />
    </Main>
  </BrowserRouter>
);

export default App;
