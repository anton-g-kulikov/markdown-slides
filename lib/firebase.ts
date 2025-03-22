// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDik2dGsBUEWVUayHqXvroG_eMoaJqgixs",
  authDomain: "markdown-slides-7099a.firebaseapp.com",
  projectId: "markdown-slides-7099a",
  storageBucket: "markdown-slides-7099a.firebasestorage.app",
  messagingSenderId: "800206620914",
  appId: "1:800206620914:web:0d9e38200f34337c4a286b",
  measurementId: "G-L0PQV17YR7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
