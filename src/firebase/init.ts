import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeFirestore, 
  memoryLocalCache, 
  getFirestore 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * @fileOverview الحل التقني النهائي لخطأ INTERNAL ASSERTION FAILED (ID: ca9).
 * يعتمد على تعطيل الكاش المستمر واستخدام Memory Cache فقط لتجنب تعارضات Next.js.
 */

// نمط Singleton لمنع إعادة التهيئة المتكررة في بيئة التطوير
const globalForFirebase = globalThis as unknown as {
  app: ReturnType<typeof initializeApp>;
  db: ReturnType<typeof initializeFirestore>;
  auth: ReturnType<typeof getAuth>;
};

// 1. تهيئة تطبيق Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. تهيئة Firestore مع إعداد memoryLocalCache (الحل المطلوب)
let db;
if (globalForFirebase.db) {
  db = globalForFirebase.db;
} else {
  try {
    // نستخدم initializeFirestore لإرسال إعدادات الكاش صراحة
    db = initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
  } catch (e) {
    // في حال كان المحرك قيد التشغيل بالفعل، نسترجع النسخة الحالية
    db = getFirestore(app);
  }
}

// 3. تهيئة خدمة الهوية
const auth = globalForFirebase.auth ?? getAuth(app);

// حفظ المراجع عالمياً في بيئة التطوير لمنع أخطاء الذاكرة أثناء الـ Hot Reload
if (process.env.NODE_ENV !== "production") {
  globalForFirebase.app = app;
  globalForFirebase.db = db;
  globalForFirebase.auth = auth;
}

export { app, db, auth };

/**
 * وظيفة التهيئة المتوافقة مع بنية المشروع الحالية
 */
export const initializeFirebase = () => ({ app, db, auth });
