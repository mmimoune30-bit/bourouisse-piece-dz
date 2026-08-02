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
 * @fileOverview تهيئة خدمات Firebase بنمط Singleton صارم جداً.
 * هذا الملف مصمم للقضاء على خطأ ID: ca9 و auth/invalid-api-key.
 */

interface FirebaseInstances {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

const GLOBAL_KEY = "__FIREBASE_INSTANCE__";

// وظيفة الحصول على النسخ المستقرة
function getInstances(): FirebaseInstances {
  if (typeof window !== "undefined" && (window as any)[GLOBAL_KEY]) {
    return (window as any)[GLOBAL_KEY];
  }

  // 1. تهيئة التطبيق
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  // 2. تهيئة Firestore بشكل دفاعي
  let firestore: Firestore;
  try {
    // محاولة استخدام النسخة الموجودة أولاً
    firestore = getFirestore(app);
  } catch (e) {
    // إذا لم تكن موجودة، نقوم بتهيئتها بإعدادات الذاكرة المؤقتة لمنع خطأ ca9
    firestore = initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
  }

  // 3. تهيئة Auth
  const auth = getAuth(app);

  const instances = { app, firestore, auth };

  if (typeof window !== "undefined") {
    (window as any)[GLOBAL_KEY] = instances;
  }

  return instances;
}

const instances = getInstances();

export const app = instances.app;
export const db = instances.firestore;
export const auth = instances.auth;

/**
 * دالة مساعدة للحصول على كافة النسخ دفعة واحدة
 */
export function initializeFirebase() {
  return { app, firestore: db, auth };
}
