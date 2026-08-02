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
 * 1. تعطيل IndexedDB تماماً واستخدام الذاكرة (Memory Cache) لمنع تعارض قفل البيانات.
 * 2. استخدام نمط Singleton صارم عبر globalThis لحماية الكائنات أثناء Fast Refresh في Next.js 15.
 * 3. معالجة استباقية للاستثناءات لضمان استقرار محرك البيانات.
 */

interface FirebaseGlobalStore {
  app?: FirebaseApp;
  db?: Firestore;
  auth?: Auth;
}

const GLOBAL_KEY = "__BOUR_FIREBASE_STABLE_V2_FINAL__";

const getGlobalStore = (): FirebaseGlobalStore => {
  if (typeof window === "undefined") return {};
  const globalScope = globalThis as any;
  if (!globalScope[GLOBAL_KEY]) {
    globalScope[GLOBAL_KEY] = {};
  }
  return globalScope[GLOBAL_KEY];
};

export const initializeFirebase = () => {
  if (typeof window === "undefined") return { app: null, db: null, auth: null };

  const store = getGlobalStore();

  try {
    // 1. تهيئة التطبيق بنمط Singleton
    if (!store.app) {
      store.app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    }

    // 2. تهيئة Firestore بنمط ذاكرة مؤقتة فقط (Memory Only) للقضاء على خطأ ID: ca9
    if (!store.db) {
      try {
        // الحل الجذري: منع استخدام IndexedDB Persistence نهائياً في بيئة العميل
        store.db = initializeFirestore(store.app, {
          localCache: memoryLocalCache(),
        });
      } catch (e) {
        // في حال كان المحرك قد تم تهيئته مسبقاً، استعد النسخة الموجودة فوراً
        store.db = getFirestore(store.app);
      }
    }

    // 3. تهيئة Auth بنمط Singleton
    if (!store.auth) {
      store.auth = getAuth(store.app);
    }

    return { app: store.app, db: store.db, auth: store.auth };
  } catch (error) {
    console.error("Critical Firebase Init Failure:", error);
    // حالة استرجاع الطوارئ (Fallback) لضمان عدم توقف التطبيق
    const fallbackApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return {
      app: fallbackApp,
      db: getFirestore(fallbackApp),
      auth: getAuth(fallbackApp),
    };
  }
};

// تصدير النسخ المباشرة والمحمية عالمياً
const instances = typeof window !== "undefined" ? initializeFirebase() : { app: null, db: null, auth: null };

export const app = instances.app;
export const db = instances.db;
export const auth = instances.auth;
