import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  initializeFirestore, 
  getFirestore, 
  memoryLocalCache,
  Firestore,
  connectFirestoreEmulator
} from "firebase/firestore";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * @fileOverview الحل التقني النهائي والمستقر لخطأ INTERNAL ASSERTION FAILED (ID: ca9).
 * 
 * المبادئ المتبعة:
 * 1. استخدام Singleton عالمي عبر globalThis لمنع تعارضات Fast Refresh.
 * 2. تعطيل IndexedDB صراحة واستخدام Memory Cache فقط لحل مشكلة قفل البيانات.
 * 3. معالجة استباقية لمحاولات إعادة التهيئة عبر try/catch.
 */

const FIREBASE_GLOBAL_KEY = "__BOUR_FIREBASE_STABLE_FINAL_V4__";

interface FirebaseInstances {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
}

function getFirebaseInstances(): FirebaseInstances {
  // الحماية من التنفيذ في جانب السيرفر
  if (typeof window === "undefined") {
    return { app: null as any, db: null as any, auth: null as any };
  }

  const globalScope = globalThis as any;

  // استرجاع النسخة الحالية إذا كانت موجودة (التعامل مع Hot Reload)
  if (!globalScope[FIREBASE_GLOBAL_KEY]) {
    try {
      // 1. تهيئة التطبيق (App)
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      
      // 2. تهيئة قاعدة البيانات (Firestore) مع تعطيل التخزين المستمر صراحة
      let db: Firestore;
      try {
        // الحل الجذري: إجبار استخدام ذاكرة التخزين المؤقت فقط لمنع خطأ ca9
        db = initializeFirestore(app, {
          localCache: memoryLocalCache(),
        });
      } catch (e) {
        // في حال كان المحرك قيد التشغيل بالفعل أو فشلت التهيئة المخصصة، نسترجع النسخة الحالية
        db = getFirestore(app);
      }

      // 3. تهيئة خدمة الهوية (Auth)
      const auth = getAuth(app);

      // حفظ النسخ في النطاق العالمي لضمان ثبات المراجع طوال فترة جلسة المتصفح
      globalScope[FIREBASE_GLOBAL_KEY] = { app, db, auth };
    } catch (error) {
      console.error("Critical Firebase Failure:", error);
      throw error;
    }
  }

  return globalScope[FIREBASE_GLOBAL_KEY];
}

// استخراج النسخ المستقرة
const instances = getFirebaseInstances();

export const app = instances.app;
export const db = instances.db;
export const auth = instances.auth;

/**
 * وظيفة التهيئة الرئيسية للتصدير (Idempotent)
 */
export const initializeFirebase = () => instances;
