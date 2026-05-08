import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tera Firebase Config - maine screenshot se copy kar liya
const firebaseConfig = {
  apiKey: "AIzaSyCoIS39WOg3bE9Mrz1rxr-uJuK-RSq9BAU",
  authDomain: "shop-analytics-6d9df.firebaseapp.com",
  projectId: "shop-analytics-6d9df",
  storageBucket: "shop-analytics-6d9df.firebasestorage.app",
  messagingSenderId: "945320227219",
  appId: "1:945320227219:web:f38919cd630375feeab866"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth export kar rahe hain Google login ke liye
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore export kar rahe hain dashboard data ke liye
export const db = getFirestore(app);

export default app;