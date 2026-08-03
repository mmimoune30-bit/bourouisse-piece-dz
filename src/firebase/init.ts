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
 * محرك تهيئة Firebase الحديدي - الإصدار النهائي المستقر.
 * يعالج تعارضات Next.js 15 عبر فصل مراجع الخادم عن العميل.
 */

const G = globalThis as any;

function getFirebaseInstance() {
  const isClient = typeof window !== "undefined";
  const instanceKey = isClient ? "__BOUR_CLIENT_FB__" : "__BOUR_SERVER_FB__";

  if (!G[instanceKey]) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    let db: Firestore;
    if (isClient) {
      // إعداد دفاعي صارم لجهة العميل لمنع خطأ (ID: ca9)
      try {
        db = initializeFirestore(app, {
          localCache: memoryLocalCache(),
          experimentalForceLongPolling: true,
        });
      } catch (e) {
        db = getFirestore(app);
      }
    } else {
      // إعداد جهة الخادم (SSR)
      db = getFirestore(app);
    }

    const auth = getAuth(app);
    G[instanceKey] = { app, db, auth };
  }

  return G[instanceKey];
}

const { app, db, auth } = getFirebaseInstance();

export { app, db, auth };
export const initializeFirebase = () => ({ app, db, auth });
