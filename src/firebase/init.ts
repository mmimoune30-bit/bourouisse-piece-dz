import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache, getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * @fileOverview محرك تهيئة Firebase المتطور.
 * تم ضبط Firestore ليعمل بأسلوب Long Polling و Memory Cache لضمان استقرار الاتصال
 * في بيئات Workstations السحابية وتجنب أخطاء GetBackend 403.
 */

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

if (getApps().length === 0) {
  // التهيئة الأولى
  app = initializeApp(firebaseConfig);
  
  if (typeof window !== "undefined") {
    // تهيئة مخصصة لجهة العميل لضمان استقرار الاتصال السحابي
    db = initializeFirestore(app, {
      localCache: memoryLocalCache(),
      experimentalForceLongPolling: true,
    });
  } else {
    // تهيئة قياسية لجهة الخادم
    db = getFirestore(app);
  }
  
  auth = getAuth(app);
} else {
  // استخدام التطبيق والخدمات القائمة بالفعل لمنع أخطاء التكرار
  app = getApp();
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };

/**
 * وظيفة تهيئة اختيارية للاستخدام في السياقات الأخرى لضمان المزامنة
 */
export const initializeFirebase = () => ({ app, db, auth });
