import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  initializeFirestore, 
  getFirestore, 
  Firestore, 
  memoryLocalCache,
  terminate
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * @fileOverview نظام تهيئة Firebase فائق الاستقرار.
 * يستخدم نمط Singleton العالمي لمنع تعارضات ID: ca9 وضمان استقرار المحرك الافتراضي.
 */

interface FirebaseStore {
  app?: FirebaseApp;
  db?: Firestore;
  auth?: Auth;
}

const GLOBAL_KEY = "__BOUR_FIREBASE_STORE__";

export const initializeFirebase = () => {
  if (typeof window === "undefined") return { app: null, db: null, auth: null };

  const globalScope = globalThis as any;
  if (!globalScope[GLOBAL_KEY]) {
    globalScope[GLOBAL_KEY] = {} as FirebaseStore;
  }

  const store = globalScope[GLOBAL_KEY] as FirebaseStore;

  try {
    // 1. تهيئة التطبيق (Singleton)
    if (!store.app) {
      store.app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    }

    // 2. تهيئة Firestore بنمط دفاعي لمنع خطأ ca9
    if (!store.db) {
      try {
        // نحاول الحصول على النسخة الحالية أولاً
        store.db = getFirestore(store.app);
      } catch (e) {
        // إذا فشلنا، نقوم بالتهيئة مع إعدادات الذاكرة المؤقتة الصريحة
        store.db = initializeFirestore(store.app, {
          localCache: memoryLocalCache(), // الذاكرة المؤقتة تمنع تعارضات IndexedDB في HMR
        });
      }
    }

    // 3. تهيئة Auth
    if (!store.auth) {
      store.auth = getAuth(store.app);
    }

    return { app: store.app, db: store.db, auth: store.auth };
  } catch (error) {
    console.error("Firebase Initialization Failure:", error);
    // حالة استرجاع الطوارئ
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return {
      app,
      db: getFirestore(app),
      auth: getAuth(app),
    };
  }
};

// تصدير النسخ المباشرة مع التحقق من البيئة
const instances = typeof window !== "undefined" ? initializeFirebase() : { app: null, db: null, auth: null };

export const app = instances.app;
export const db = instances.db;
export const auth = instances.auth;
