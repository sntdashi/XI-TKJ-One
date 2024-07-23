// Import fungsi yang diperlukan dari SDK Firebase
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyCgoPSLkdHYLrn4njbdX1JIoSk1KrxFLEA",
  authDomain: "xii-tkj-one.firebaseapp.com",
  databaseURL: "https://xii-tkj-one-default-rtdb.firebaseio.com",
  projectId: "xii-tkj-one",
  storageBucket: "xii-tkj-one.appspot.com",
  messagingSenderId: "301795205174",
  appId: "1:301795205174:web:e67d56eb0a8434747fb897"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor instance storage dari Firebase
export const storage = getStorage(app);

// Ekspor instance Firestore dari Firebase
export const db = getFirestore(app);

// Ekspor instance auth dan GoogleAuthProvider dari Firebase Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
