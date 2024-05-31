import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/*
const firebaseConfig = {
  apiKey: "AIzaSyB2rcpW959s25Kc9XEMJla03FULyC3I7ZU",
  authDomain: "tournament-f8373.firebaseapp.com",
  projectId: "tournament-f8373",
  storageBucket: "tournament-f8373.appspot.com",
  messagingSenderId: "525160333112",
  appId: "1:525160333112:web:f01ba8fbbb47a5f0df0bcd"
};
*/

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2rcpW959s25Kc9XEMJla03FULyC3I7ZU",
  authDomain: "tournament-f8373.firebaseapp.com",
  projectId: "tournament-f8373",
  storageBucket: "tournament-f8373.appspot.com",
  messagingSenderId: "525160333112",
  appId: "1:525160333112:web:f01ba8fbbb47a5f0df0bcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
