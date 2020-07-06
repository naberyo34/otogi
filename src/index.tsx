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
    font-feature-settings: 'palt';
    color: #444;
    background: #f6f6f6;
  }

  * {
    line-height: 1;
  }

  p {
    line-height: 1.5;
  }

  button, select, input, label {
    padding: 0.5em 1em;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    appearance: none;
    border: none;
    border-radius: 2em;

    &:hover {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
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
