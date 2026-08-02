import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeFirestore, 
  getFirestore, 
  memoryLocalCache,
  Firestore
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * @fileOverview الحل التقني النهائي والمستقر لخطأ INTERNAL ASSERTION FAILED (ID: ca9).
 * 
 * المبادئ المتبعة:
 * 1. استخدام Singleton عالمي عبر globalThis لمنع تعارضات Fast Refresh.
 * 2. تعطيل IndexedDB صراحة واستخدام Memory Cache فقط لحل مشكلة قفل البيانات.
 * 3. معالجة استباقية لمحاولات إعادة التهيئة (Idempotent Initialization).
 */

const FIREBASE_GLOBAL_KEY = "__BOUR_FIREBASE_STABLE_V3__";

function getFirebaseInstances() {
  // الحماية من التنفيذ في جانب السيرفر
  if (typeof window === "undefined") {
    return { app: null, db: null, auth: null };
  }

  const globalScope = globalThis as any;

  // استرجاع النسخة الحالية إذا كانت موجودة (التعامل مع Hot Reload)
  if (!globalScope[FIREBASE_GLOBAL_KEY]) {
    try {
      // 1. تهيئة التطبيق (App)
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      
      // 2. تهيئة قاعدة البيانات (Firestore) مع تعطيل التخزين المستمر
      let db: Firestore;
      try {
        // محاولة التهيئة بالإعدادات المخصصة (ذاكرة فقط)
        db = initializeFirestore(app, {
          localCache: memoryLocalCache(),
        });
      } catch (e) {
        // إذا فشل (بسبب تهيئة سابقة مثلاً)، نسترجع النسخة الموجودة
        db = getFirestore(app);
      }

      // 3. تهيئة خدمة الهوية (Auth)
      const auth = getAuth(app);

      // حفظ النسخ في النطاق العالمي
      globalScope[FIREBASE_GLOBAL_KEY] = { app, db, auth };
    } catch (error) {
      console.error("Critical Firebase Failure:", error);
      return { app: null, db: null, auth: null };
    }
  }

  return globalScope[FIREBASE_GLOBAL_KEY];
}

// تصدير النسخ المستقرة
const instances = getFirebaseInstances();

export const app = instances.app;
export const db = instances.db;
export const auth = instances.auth;

/**
 * وظيفة التهيئة الرئيسية للتصدير
 */
export const initializeFirebase = () => instances;
