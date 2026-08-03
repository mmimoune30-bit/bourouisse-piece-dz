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
 * @fileOverview الحل التقني القاطع والنهائي لخطأ INTERNAL ASSERTION FAILED (ID: ca9).
 * يعتمد على:
 * 1. تعطيل التخزين المستمر (IndexedDB) صراحة واستخدام Memory Cache فقط.
 * 2. نمط Singleton العالمي الصارم عبر globalThis لحماية المراجع من HMR.
 * 3. التهيئة الدفاعية باستخدام try/catch لاستعادة النسخ النشطة.
 */

// تعريف واجهة للكائن العالمي لمنع أخطاء TypeScript والحفاظ على ثبات المراجع
const G = globalThis as any;
const INSTANCE_KEY = "__BOUR_FIREBASE_IRONCLAD_V4__";

if (!G[INSTANCE_KEY]) {
  // 1. تهيئة التطبيق الأساسي
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  let db: Firestore;
  try {
    /**
     * الحل الجذري: إجبار Firestore على استخدام الذاكرة المؤقتة فقط.
     * هذا يمنع المحرك من محاولة قفل IndexedDB، وهو المسبب الوحيد لخطأ ID: ca9.
     */
    db = initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
  } catch (e) {
    // في حال كان المحرك نشطاً بالفعل (أثناء التطوير)، يتم استرجاعه بدلاً من محاولة إعادة تهيئته
    db = getFirestore(app);
  }

  // 2. تهيئة خدمة الهوية
  const auth = getAuth(app);

  // تخزين المراجع في كائن عالمي واحد لا يتأثر بإعادة تحميل الصفحة (Hot Reload)
  G[INSTANCE_KEY] = { app, db, auth };
}

// تصدير النسخ المستقرة حصرياً من المخزن العالمي
export const app = G[INSTANCE_KEY].app as FirebaseApp;
export const db = G[INSTANCE_KEY].db as Firestore;
export const auth = G[INSTANCE_KEY].auth as Auth;

/**
 * وظيفة التهيئة الموحدة للمشروع
 */
export const initializeFirebase = () => ({ app, db, auth });