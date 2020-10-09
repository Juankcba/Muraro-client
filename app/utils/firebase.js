import firebase from "firebase/app";

var firebaseConfig = {
  apiKey: "AIzaSyBWxLzMaSaZKp1JB-HIk8ySH3raiiRE9lo",
  authDomain: "muraro-f74aa.firebaseapp.com",
  databaseURL: "https://muraro-f74aa.firebaseio.com",
  projectId: "muraro-f74aa",
  storageBucket: "muraro-f74aa.appspot.com",
  messagingSenderId: "695545059912",
  appId: "1:695545059912:web:3fffba29ca024c513ed67d",
  measurementId: "G-EPE9PXD5KD",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
