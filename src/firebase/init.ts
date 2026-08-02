import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  initializeFirestore, 
  getFirestore, 
  Firestore, 
  memoryLocalCache
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * @fileOverview الحل التقني الجذري والنهائي لخطأ INTERNAL ASSERTION FAILED (ID: ca9).
 * يتم هنا استخدام نمط Singleton صارم عبر globalThis وتعطيل IndexedDB تماماً.
 */

const FIREBASE_GLOBAL_KEY = "__BOUR_FIREBASE_STORE_V2__";

function getFirebaseInstances() {
  if (typeof window === "undefined") {
    return { app: null, db: null, auth: null };
  }

  const globalScope = globalThis as any;

  if (!globalScope[FIREBASE_GLOBAL_KEY]) {
    try {
      // 1. تهيئة التطبيق
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      
      // 2. تهيئة Firestore بنمط ذاكرة مؤقتة فقط (Memory Only)
      let db: Firestore;
      try {
        db = initializeFirestore(app, {
          localCache: memoryLocalCache(),
        });
      } catch (e) {
        // استرجاع النسخة الموجودة في حال كانت مهيأة مسبقاً
        db = getFirestore(app);
      }

      // 3. تهيئة Auth
      const auth = getAuth(app);

      globalScope[FIREBASE_GLOBAL_KEY] = { app, db, auth };
    } catch (error) {
      console.error("Critical Firebase Initialization Failure:", error);
      return { app: null, db: null, auth: null };
    }
  }

  return globalScope[FIREBASE_GLOBAL_KEY];
}

const instances = getFirebaseInstances();

export const app = instances.app;
export const db = instances.db;
export const auth = instances.auth;

export const initializeFirebase = () => instances;
