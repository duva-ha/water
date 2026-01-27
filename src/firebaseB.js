// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQmerSSs0qhO01xNnFWpquZYseDThWxP0",
  authDomain: "lichtruc-e3f82.firebaseapp.com",
  projectId: "lichtruc-e3f82",
  storageBucket: "lichtruc-e3f82.firebasestorage.app",
  messagingSenderId: "476557236437",
  appId: "1:476557236437:web:dfb1cb5848642daecdaa5c",
  measurementId: "G-QYQCZCLWR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
No
