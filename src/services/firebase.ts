import firebase from 'firebase/app';
import 'firebase/firestore';
import ReduxSagaFirebase from 'redux-saga-firebase';

const myFirebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyCQFnLPADvyXyzyMSFKwhBBqSQC5syLzZw',
  authDomain: 'otogi-trpg.firebaseapp.com',
  databaseURL: 'https://otogi-trpg.firebaseio.com',
  projectId: 'otogi-trpg',
  storageBucket: 'otogi-trpg.appspot.com',
  messagingSenderId: '997195048792',
  appId: '1:997195048792:web:f17fd6f1cd4d0bc982272d',
});
const reduxSagaFirebase = new ReduxSagaFirebase(myFirebaseApp);

export default reduxSagaFirebase;
// TODO: anyでキャストしてreduxSagaFirebaseを黙らせている. 多分パッケージ側の問題
export const diceLogsQuery = myFirebaseApp
  .firestore()
  .collection('dicelogs')
  .orderBy('timestamp', 'asc');
