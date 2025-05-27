import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "letsmeetoffline-32317.firebaseapp.com",
  projectId: "letsmeetoffline-32317",
  storageBucket: "letsmeetoffline-32317.firebasestorage.app",
  messagingSenderId: "956396674860",
  appId: "1:956396674860:web:eccc8cf0c8cdcb0ac15689",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
