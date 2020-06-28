import functions from 'firebase-functions';
import express from 'express';
import basicAuth from 'express-basic-auth';

const app = express();

app.use(
  basicAuth({
    users: {
      admin: 'passw0rd',
    },
  })
);

exports.app = functions.https.onRequest(app);
