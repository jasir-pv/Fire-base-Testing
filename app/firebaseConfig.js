import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase Config
const firebaseConfig = {
  apiKey: AIzaSyD7R6nL1PWSEiMR0-MA8XAzWFR117cun4g,
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: fireauth-9b66d,
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "Y1:1050838676062:android:ad67e6cf17e904f4a87acf",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;
export { auth };
