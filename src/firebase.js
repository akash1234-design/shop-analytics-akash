import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxiB7to1Hsdz8wOZnzrvr-u3Uf-N4p9BAU",
  authDomain: "shop-analytics-6d9df.firebaseapp.com",
  projectId: "shop-analytics-6d9df",
  storageBucket: "shop-analytics-6d9df.firebasestorage.app",
  messagingSenderId: "945328272719",
  appId: "1:945328272719:web:f38019d630575feeehB66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Ye 2 cheez export karni zaruri hai
export const auth = getAuth(app);
export const db = getFirestore(app);  // ← Dashboard.js ke liye ye chahiye

export default app;