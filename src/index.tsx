import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import 'minireset.css';
import configureStore from 'store/configureStore';
import App from 'App';
import * as serviceWorker from 'serviceWorker';

const GlobalStyle = createGlobalStyle`
  html {
    font-family: "ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN","メイリオ",Meiryo,sans-serif;
    font-size: 62.5%;
    line-height: 1;
    font-feature-settings: 'palt';
    color: #333;
    background: #f6f6f6;
  }

  p {
    line-height: 1.5;
  }

  button, select, input {
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    cursor: pointer;
    background: none;
    border: none;
    appearance: none;
  }

  select, input {
    padding: 4px 8px;
    border: 1px solid #aaa;
    border-radius: 4px;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.16);
    }
  }
`;

ReactDOM.render(
  <Provider store={configureStore}>
    <React.StrictMode>
      <GlobalStyle />
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
