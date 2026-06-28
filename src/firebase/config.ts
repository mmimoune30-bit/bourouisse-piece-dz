import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCuEeMKi40m6HSkV9ePAvpkZNjHQmOsNjE",
  authDomain: "studio-6660467819-36b41.firebaseapp.com",
  projectId: "studio-6660467819-36b41",
  storageBucket: "studio-6660467819-36b41.firebasestorage.app",
  messagingSenderId: "6660467819",
  appId: "1:6660467819:web:10340788d67285517173b2",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app;
