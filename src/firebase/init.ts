import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  initializeFirestore, 
  memoryLocalCache, 
  getFirestore, 
  Firestore 
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

/**
 * محرك تهيئة Firebase الدفاعي - النسخة النهائية المستقرة.
 * يحل مشاكل التحميل اللانهائي وتعريفات المراجع المتكررة.
 */

const G = globalThis as any;

function getFirebaseInstance() {
  const isClient = typeof window !== "undefined";
  const instanceKey = isClient ? "__BOUR_STABLE_CLIENT_FB__" : "__BOUR_STABLE_SERVER_FB__";

  if (!G[instanceKey]) {
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      
      let db: Firestore;
      if (isClient) {
        // إعداد العميل: استخدام ذاكرة الرام فقط لمنع تعارضات IndexedDB
        db = initializeFirestore(app, {
          localCache: memoryLocalCache(),
          experimentalForceLongPolling: true, // يضمن الاتصال في البيئات المقيدة
        });
      } else {
        // إعداد الخادم
        db = getFirestore(app);
      }

      const auth = getAuth(app);
      G[instanceKey] = { app, db, auth };
    } catch (error) {
      console.error("CRITICAL FIREBASE INIT ERROR:", error);
      // Fallback instance to prevent total crash
      const app = getApps()[0] || initializeApp(firebaseConfig);
      G[instanceKey] = { app, db: getFirestore(app), auth: getAuth(app) };
    }
  }

  return G[instanceKey];
}

const { app, db, auth } = getFirebaseInstance();

export { app, db, auth };
export const initializeFirebase = () => ({ app, db, auth });
