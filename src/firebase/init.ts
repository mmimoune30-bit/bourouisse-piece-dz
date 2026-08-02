import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  initializeFirestore, 
  getFirestore, 
  Firestore, 
  memoryLocalCache,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * @fileOverview نظام تهيئة Firebase فائق الاستقرار.
 * يستخدم نمط Singleton العالمي لمنع تعارضات ID: ca9 وضمان استقرار المحرك الافتراضي في Next.js 15.
 */

interface FirebaseStore {
  app?: FirebaseApp;
  db?: Firestore;
  auth?: Auth;
}

const GLOBAL_KEY = "__BOUR_FIREBASE_STORE_V2__";

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
        // في بيئة التطوير، نستخدم الذاكرة المؤقتة فقط لمنع تعارضات IndexedDB Lock (ID: ca9)
        if (process.env.NODE_ENV === 'development') {
          store.db = initializeFirestore(store.app, {
            localCache: memoryLocalCache(),
          });
        } else {
          // في الإنتاج، نستخدم التخزين المستمر للأداء
          store.db = initializeFirestore(store.app, {
            localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
          });
        }
      } catch (e) {
        // إذا فشلنا في التهيئة المخصصة، نستعيد النسخة الافتراضية
        console.warn("Firestore custom init failed, falling back to getFirestore:", e);
        store.db = getFirestore(store.app);
      }
    }

    // 3. تهيئة Auth
    if (!store.auth) {
      store.auth = getAuth(store.app);
    }

    return { app: store.app, db: store.db, auth: store.auth };
  } catch (error) {
    console.error("Critical Firebase Initialization Failure:", error);
    // حالة استرجاع الطوارئ القصوى
    const fallbackApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return {
      app: fallbackApp,
      db: getFirestore(fallbackApp),
      auth: getAuth(fallbackApp),
    };
  }
};

// تصدير النسخ المباشرة (للخادم أو الوصول السريع)
const instances = typeof window !== "undefined" ? initializeFirebase() : { app: null, db: null, auth: null };

export const app = instances.app;
export const db = instances.db;
export const auth = instances.auth;
