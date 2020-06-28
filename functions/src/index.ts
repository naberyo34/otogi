import * as functions from 'firebase-functions';
import express from 'express';
import path from 'path';

// TODO: 型定義ファイルが存在しないのでrequireで読んでる
// eslint-disable-next-line
const basicAuth = require('basic-auth-connect');
const app = express();

// basic認証
app.all(
  '/*',
  basicAuth(
    (user: string, password: string) =>
      user === 'admin' && password === 'passw0rd'
  )
);

// 認証後に静的ファイルのホスティングを行う
app.use(express.static(path.resolve(__dirname, '../build')));

// SPAのため、どのURLにリクエストが飛んできてもindex.htmlを返す
app.get('/*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

exports.firebaseAuth = functions.https.onRequest(app);
