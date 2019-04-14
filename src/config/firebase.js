import firebase from 'firebase';

  // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBsE7JLLyUvXh23Jh7QRxKcz53FO-t8g-c",
      authDomain: "invoiceapp-6b3a5.firebaseapp.com",
      databaseURL: "https://invoiceapp-6b3a5.firebaseio.com",
      projectId: "invoiceapp-6b3a5",
      storageBucket: "invoiceapp-6b3a5.appspot.com",
      messagingSenderId: "907625680460"
    };
  
  const firebaseConfig = firebase.initializeApp(config);

  export default firebaseConfig;
