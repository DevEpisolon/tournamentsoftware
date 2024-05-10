import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyr-HXk9FMiVWnm060YeHCCVxWZ-aBIUY",

  authDomain: "tas-32.firebaseapp.com",

  projectId: "tas-32",

  storageBucket: "tas-32.appspot.com",

  messagingSenderId: "179331796049",

  appId: "1:179331796049:web:de8663e104bc71adff7c70",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
