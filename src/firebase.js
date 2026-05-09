// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ye config Firebase Console se copy karke yahan daal de
const firebaseConfig = {
  apiKey:  "AIzaSyCDfjRpok5hDwYJWpvXQE0Y75f-7tfFx2k",
  authDomain: "shop-analytics-6d9df.firebaseapp.com",
  projectId: "shop-analytics-6d9df",
  storageBucket: "shop-analytics-6d9df.firebasestorage.app",
  messagingSenderId: "945328272719",
  appId: "1:945328272719:web:f6cbb6eb4c1be0ee9d6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports - Ye lines zaruri hain
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;