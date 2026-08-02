'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache, 
  persistentLocalCache,
  Firestore,
  clearIndexedDbPersistence
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase بنمط Singleton فائق الاستقرار لمعالجة خطأ ca9 وانهيار العميل في Next.js.
 */
export function initializeFirebase() {
  // 1. التأكد من أننا في جهة العميل
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  const g = globalThis as any;

  // 2. استعادة النسخ المستقرة من الكائن العالمي إذا كانت موجودة (HMR Resilience)
  if (g.__FIREBASE_STABLE_INSTANCES__) {
    return g.__FIREBASE_STABLE_INSTANCES__;
  }

  try {
    // 3. تهيئة التطبيق (Idempotent)
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 4. تهيئة Firestore بدقة (حل خطأ ca9)
    let firestore: Firestore;
    
    // فحص بيئة العمل
    const isDev = process.env.NODE_ENV === 'development';

    try {
      // استخدام ذاكرة التخزين المؤقت في التطوير يمنع تعارض IndexedDB (ca9 error)
      firestore = initializeFirestore(app, {
        localCache: isDev ? memoryLocalCache() : persistentLocalCache({}),
      });
    } catch (e) {
      // إذا فشلت التهيئة المخصصة (بسبب وجودها مسبقاً)، نستخدم النسخة الافتراضية
      firestore = getFirestore(app);
    }

    // 5. تهيئة Auth
    const auth = getAuth(app);

    const instances = { app, firestore, auth };
    
    // تخزين عالمي لضمان بقاء المراجع حية ومستقرة تماماً
    g.__FIREBASE_STABLE_INSTANCES__ = instances;

    return instances;
  } catch (error) {
    console.error("Critical Firebase Init Fail:", error);
    // العودة للوضع الافتراضي في حالة الفشل القصوى لتجنب كسر التطبيق
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { 
      app, 
      firestore: getFirestore(app), 
      auth: getAuth(app) 
    };
  }
}
