import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJOuh5iA9bwDdAzpKJK4023uQogjleEGs",
  authDomain: "pruebaed2-fd280.firebaseapp.com",
  projectId: "pruebaed2-fd280",
  storageBucket: "pruebaed2-fd280.firebasestorage.app",
  messagingSenderId: "300827546072",
  appId: "1:300827546072:web:175454a4ce0b7b3ed122ad",
  measurementId: "G-XGST0W8NSC"
};

//-Initialize Firebase
const app = initializeApp(firebaseConfig);

//-Initialize Firebase Authentication
const auth = getAuth(app);

//-Initialize Firestore (Tasks)
const db = getFirestore(app);
export { app, auth, db };