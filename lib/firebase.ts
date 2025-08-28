// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6iE4Nm95ak7TCaDoJqw5P50eaZNjfrQk",
  authDomain: "genixai1.firebaseapp.com",
  projectId: "genixai1",
  storageBucket: "genixai1.firebasestorage.app",
  messagingSenderId: "656114830558",
  appId: "1:656114830558:web:a222c531fcdb723954c64f",
  measurementId: "G-4BQ9FKHEXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

const auth = getAuth(app);
const db = getFirestore(app);

// Export app, analytics, auth, and db if needed elsewhere
export { app, analytics, auth, db };