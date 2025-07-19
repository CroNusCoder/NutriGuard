// config/firebase.js
import { initializeApp } from "firebase/app";
// import { getAuth } from 'firebase/auth';
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyADcKqMn7kw-ldG99Ize8ABVJVSH8_9phY",
  authDomain: "nutriguard-6fa8d.firebaseapp.com",
  projectId: "nutriguard-6fa8d",
  storageBucket: "nutriguard-6fa8d.appspot.com",
  messagingSenderId: "570070955941",
  appId: "1:570070955941:web:260878085f3fb9fc289a4c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Correct Auth Initialization with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
