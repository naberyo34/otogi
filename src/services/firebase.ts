import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQFnLPADvyXyzyMSFKwhBBqSQC5syLzZw",
  authDomain: "otogi-trpg.firebaseapp.com",
  databaseURL: "https://otogi-trpg.firebaseio.com",
  projectId: "otogi-trpg",
  storageBucket: "otogi-trpg.appspot.com",
  messagingSenderId: "997195048792",
  appId: "1:997195048792:web:f17fd6f1cd4d0bc982272d"
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

export { firebase, firestore };
