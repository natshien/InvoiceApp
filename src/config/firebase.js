import firebase from 'firebase';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA0BkIz2vntFWUuFdtJAYCLZR9bkiIEIaY",
    authDomain: "paszczur-80cbe.firebaseapp.com",
    databaseURL: "https://paszczur-80cbe.firebaseio.com",
    projectId: "paszczur-80cbe",
    storageBucket: "paszczur-80cbe.appspot.com",
    messagingSenderId: "603527532449"
  };
  const firebaseConfig = firebase.initializeApp(config);

  export default firebaseConfig;
