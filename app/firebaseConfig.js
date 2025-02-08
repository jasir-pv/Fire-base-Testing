// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7R6nL1PWSEiMR0-MA8XAzWFR117cun4g",
  authDomain: "fireauth-9b66d.firebaseapp.com",
  projectId: "fireauth-9b66d",
  storageBucket: "fireauth-9b66d.firebasestorage.app",
  messagingSenderId: "1050838676062",
  appId: "1:1050838676062:web:f64967abd005b0f6a87acf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ Ensure Firebase Auth is initialized
const storage = getStorage(app); // ✅ Initialize Firebase Storage

export { app, auth, storage };