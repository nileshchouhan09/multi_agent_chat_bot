// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "pet-paradise-4ec9a.firebaseapp.com",
  projectId: "pet-paradise-4ec9a",
  storageBucket: "pet-paradise-4ec9a.firebasestorage.app",
  messagingSenderId: "725383831199",
  appId: "1:725383831199:web:006c83039502f78ea28caa",
  measurementId: "G-RJT31JRSW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
