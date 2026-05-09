import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfrkwScUmDy-Mv-Q69X7St-7Jf-x2s",
  authDomain: "shop-analytics-6d9df.firebaseapp.com",
  projectId: "shop-analytics-6d9df",
  storageBucket: "shop-analytics-6d9df.firebasestorage.app",
  messagingSenderId: "945328272719",
  appId: "1:945328272719:web:f6cbb6eb4c1be0ee9d6a"
};

console.log("Firebase Config:", firebaseConfig); // ← Ye line add kar

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);