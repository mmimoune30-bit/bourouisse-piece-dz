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
 * @fileOverview تهيئة خدمات Firebase بنمط Singleton صارم.
 * يحل هذا الملف مشكلتين:
 * 1. auth/invalid-api-key: عبر استخدام الإعدادات المباشرة من config.ts.
 * 2. ID: ca9: عبر استخدام الذاكرة المؤقتة وتثبيت النسخ في globalThis.
 */

const globalForFirebase = globalThis as unknown as {
  app: FirebaseApp | undefined;
  db: Firestore | undefined;
  auth: Auth | undefined;
};

// تهيئة التطبيق (استخدام النسخة الموجودة أو إنشاء واحدة جديدة)
export const app = globalForFirebase.app ?? (getApps().length ? getApp() : initializeApp(firebaseConfig));

// تهيئة Firestore مع حماية ضد إعادة التهيئة (خطأ ca9)
export const db = globalForFirebase.db ?? (() => {
  try {
    // محاولة إنشاء Firestore مع ذاكرة مؤقتة لمنع تعارضات الملفات في بيئة التطوير
    return initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
  } catch (e) {
    // في حال كان Firestore مهيأ مسبقاً (أثناء Fast Refresh)
    return getFirestore(app);
  }
})();

// تهيئة Auth
export const auth = globalForFirebase.auth ?? getAuth(app);

// تخزين النسخ عالمياً لمنع التكرار المسبب للأخطاء
if (typeof window !== "undefined") {
  globalForFirebase.app = app;
  globalForFirebase.db = db;
  globalForFirebase.auth = auth;
}

/**
 * دالة مساعدة للحصول على كافة النسخ دفعة واحدة
 */
export function initializeFirebase() {
  return { app, firestore: db, auth };
}
