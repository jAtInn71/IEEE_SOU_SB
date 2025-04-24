import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeOKUpHbpox95XTpivbLvUjuJ_Edj-kGA",
  authDomain: "ieeesousb.firebaseapp.com",
  projectId: "ieeesousb",
  storageBucket: "ieeesousb.firebasestorage.app",
  messagingSenderId: "457059268416",
  appId: "1:457059268416:web:5cfc2ad4697d3824862ca5",
  measurementId: "G-K65JDFL8Q8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // ✅ Initialize auth
const db = getFirestore(app); // ✅ Initialize Firestore

// ✅ Export the auth and db objects
export { auth, db };