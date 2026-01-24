import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtIFV_j5P4Th4GU8MV3-jq8Jm1OsYh9KE",
  authDomain: "chess-3028e.firebaseapp.com",
  projectId: "chess-3028e",
  storageBucket: "chess-3028e.firebasestorage.app",
  messagingSenderId: "358627129759",
  appId: "1:358627129759:web:938bbc04efd60a821ea5aa",
  measurementId: "G-KXMTVZM5F0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
