import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCNd55VAwKv75ov3bYHK9GqbDAduTnCDDE",
    authDomain: "holiday-potluck.firebaseapp.com",
    databaseURL: "https://holiday-potluck.firebaseio.com",
    projectId: "holiday-potluck",
    storageBucket: "holiday-potluck.appspot.com",
    messagingSenderId: "18847671960"
  };
  
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;