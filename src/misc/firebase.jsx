import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyAVhKE-zOZBSmRF1VZf6T2yA_u4s2XZ-U4',

  authDomain: 'chat-web-app-7d894.firebaseapp.com',

  databaseURL:
    'https://chat-web-app-7d894-default-rtdb.asia-southeast1.firebasedatabase.app',

  projectId: 'chat-web-app-7d894',

  storageBucket: 'chat-web-app-7d894.appspot.com',

  messagingSenderId: '449989922513',

  appId: '1:449989922513:web:ee32d632e2f2d36760fff0',
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
