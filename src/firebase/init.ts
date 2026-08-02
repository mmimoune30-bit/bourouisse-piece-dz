import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeFirestore, 
  getFirestore, 
  memoryLocalCache,
  Firestore
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * @fileOverview الحل التقني النهائي والمستقر لخطأ INTERNAL ASSERTION FAILED (ID: ca9).
 * 
 * المبادئ المتبعة:
 * 1. استخدام Singleton عالمي عبر globalThis لمنع تعارضات Fast Refresh.
 * 2. تعطيل IndexedDB صراحة واستخدام Memory Cache فقط لحل مشكلة قفل البيانات.
 * 3. معالجة استباقية لمحاولات إعادة التهيئة عبر try/catch.
 */

const FIREBASE_GLOBAL_KEY = "__BOUR_FIREBASE_STABLE_FINAL__";

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
      
      // 2. تهيئة قاعدة البيانات (Firestore) مع تعطيل التخزين المستمر صراحة
      let db: Firestore;
      try {
        // الحل الجذري: إجبار استخدام ذاكرة التخزين المؤقت فقط لمنع خطأ ca9
        db = initializeFirestore(app, {
          localCache: memoryLocalCache(),
        });
      } catch (e) {
        // في حال كان المحرك قيد التشغيل بالفعل، نسترجع النسخة الحالية فقط
        db = getFirestore(app);
      }

      // 3. تهيئة خدمة الهوية (Auth)
      const auth = getAuth(app);

      // حفظ النسخ في النطاق العالمي لضمان ثبات المراجع
      globalScope[FIREBASE_GLOBAL_KEY] = { app, db, auth };
    } catch (error) {
      console.error("Critical Firebase Failure:", error);
      return { app: null, db: null, auth: null };
    }
  }

  return globalScope[FIREBASE_GLOBAL_KEY];
}

// تصدير النسخ المستقرة كـ Singletons
const instances = getFirebaseInstances();

export const app = instances.app;
export const db = instances.db;
export const auth = instances.auth;

/**
 * وظيفة التهيئة الرئيسية للتصدير
 */
export const initializeFirebase = () => instances;
