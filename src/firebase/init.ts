import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  initializeFirestore, 
  memoryLocalCache, 
  getFirestore, 
  Firestore 
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * @fileOverview الحل التقني القاطع لخطأ INTERNAL ASSERTION FAILED (ID: ca9).
 * يعتمد على:
 * 1. تعطيل التخزين المستمر (IndexedDB) صراحة واستخدام Memory Cache فقط.
 * 2. نمط Singleton العالمي الصارم عبر globalThis لحماية المراجع من HMR.
 * 3. التهيئة الدفاعية باستخدام try/catch.
 */

// تعريف واجهة للكائن العالمي لمنع أخطاء TypeScript
const G = globalThis as any;

// 1. تهيئة التطبيق (Singleton)
export const app: FirebaseApp = (function() {
  if (G._BOUR_FIREBASE_APP) return G._BOUR_FIREBASE_APP;
  const newApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  G._BOUR_FIREBASE_APP = newApp;
  return newApp;
})();

// 2. تهيئة Firestore مع تعطيل IndexedDB صراحة (Singleton)
export const db: Firestore = (function() {
  if (G._BOUR_FIREBASE_DB) return G._BOUR_FIREBASE_DB;
  
  let firestoreInstance: Firestore;
  try {
    // المحاولة الأولى: تهيئة نظيفة بذاكرة مؤقتة فقط
    firestoreInstance = initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
  } catch (e) {
    // المحاولة الثانية: استرجاع النسخة الحالية إذا كانت موجودة مسبقاً
    firestoreInstance = getFirestore(app);
  }
  
  G._BOUR_FIREBASE_DB = firestoreInstance;
  return firestoreInstance;
})();

// 3. تهيئة خدمة الهوية (Singleton)
export const auth: Auth = (function() {
  if (G._BOUR_FIREBASE_AUTH) return G._BOUR_FIREBASE_AUTH;
  const authInstance = getAuth(app);
  G._BOUR_FIREBASE_AUTH = authInstance;
  return authInstance;
})();

/**
 * تصدير وظيفة التهيئة الموحدة للمشروع
 */
export const initializeFirebase = () => ({ app, db, auth });
