
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * @fileOverview محرك تهيئة Firebase القياسي.
 * تم تبسيط التهيئة لتجنب أخطاء GetBackend 403 الناتجة عن محاولات اكتشاف السيرفر التلقائية.
 */

const getFirebaseInstance = () => {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  return { app, db, auth };
};

export const { app, db, auth } = getFirebaseInstance();

// وظيفة تهيئة اختيارية للاستخدام في السياقات الأخرى
export const initializeFirebase = () => ({ app, db, auth });
