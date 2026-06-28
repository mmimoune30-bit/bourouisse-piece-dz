'use client';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// إعدادات Firebase للمشروع
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCuEeMKi40m6HSkV9ePAvpkZNjHQmOsNjE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-6660467819-36b41.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-6660467819-36b41",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-6660467819-36b41.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "289128788555",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:289128788555:web:c91d5f5569c3e159b493ce"
};

// تهيئة Firebase لضمان عدم التكرار خاصة في وضع التطوير (Hot Reloading)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };
