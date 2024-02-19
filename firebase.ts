// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxUMziy3_qvsoyP889krUr73PJibknk2c",
  authDomain: "tic-tac-squared.firebaseapp.com",
  projectId: "tic-tac-squared",
  storageBucket: "tic-tac-squared.appspot.com",
  messagingSenderId: "115381341569",
  appId: "1:115381341569:web:8c90d1b07c09d9ff6e6c80",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
