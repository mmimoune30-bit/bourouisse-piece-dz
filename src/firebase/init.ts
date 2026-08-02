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
 * @fileOverview نظام تهيئة Firebase فائق الاستقرار.
 * يستخدم نمط Singleton العالمي لمنع تعارضات ID: ca9 وضمان صحة الـ API Key.
 */

interface FirebaseInstances {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
}

const GLOBAL_KEY = "__BOUR_FIREBASE_INSTANCE__";

export const initializeFirebase = (): FirebaseInstances => {
  // التأكد من العمل في جهة العميل فقط
  if (typeof window === "undefined") {
    return {} as any;
  }

  const globalScope = globalThis as any;

  // استعادة النسخة إذا كانت موجودة مسبقاً (لحماية Fast Refresh)
  if (globalScope[GLOBAL_KEY]) {
    return globalScope[GLOBAL_KEY];
  }

  try {
    // 1. تهيئة التطبيق باستخدام الإعدادات الصحيحة من config.ts
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

    // 2. تهيئة Firestore بنمط دفاعي
    // نستخدم الذاكرة المؤقتة (Memory) لمنع خطأ ca9 الناتج عن تعارض قفل IndexedDB
    const db = initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });

    // 3. تهيئة Auth
    const auth = getAuth(app);

    const instances: FirebaseInstances = { app, db, auth };

    // حفظ النسخة عالمياً
    globalScope[GLOBAL_KEY] = instances;

    return instances;
  } catch (error) {
    console.warn("Firebase recovery mode activated:", error);
    const app = getApp();
    return {
      app,
      db: getFirestore(app),
      auth: getAuth(app),
    };
  }
};

// تصدير النسخ للاستخدام السريع (مع فحص الأمان)
const instances = typeof window !== "undefined" ? initializeFirebase() : { app: null, db: null, auth: null };

export const app = instances.app as FirebaseApp;
export const db = instances.db as Firestore;
export const auth = instances.auth as Auth;
