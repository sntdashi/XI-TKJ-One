// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCgoPSLkdHYLrn4njbdX1JIoSk1KrxFLEA",
  authDomain: "xii-tkj-one.firebaseapp.com",
  databaseURL: "https://xii-tkj-one-default-rtdb.firebaseio.com",
  projectId: "xii-tkj-one",
  storageBucket: "xii-tkj-one.appspot.com",
  messagingSenderId: "301795205174",
  appId: "1:301795205174:web:e67d56eb0a8434747fb897",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();