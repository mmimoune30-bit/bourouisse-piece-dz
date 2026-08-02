'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache, 
  clearIndexedDbPersistence,
  Firestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase بنمط Singleton فائق الاستقرار لمعالجة خطأ ca9 وانهيار العميل.
 */
export function initializeFirebase() {
  // 1. التأكد من أننا في جهة العميل
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  const g = globalThis as any;

  // 2. استعادة النسخ المستقرة إذا كانت موجودة
  if (g.__FIREBASE_STABLE_INSTANCES__) {
    return g.__FIREBASE_STABLE_INSTANCES__;
  }

  try {
    // 3. تهيئة التطبيق (Idempotent)
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 4. تهيئة Firestore بدقة
    let firestore: Firestore;
    
    // محاولة تنظيف الذاكرة القديمة بصمت لحل تعارضات ca9
    try {
      const tempDb = getFirestore(app);
      clearIndexedDbPersistence(tempDb).catch(() => {});
    } catch (e) {}

    // استخدام الذاكرة المؤقتة (Memory Cache) هو الحل الأضمن لـ Studio/HMR
    try {
      firestore = initializeFirestore(app, {
        localCache: memoryLocalCache(),
      });
    } catch (e) {
      // إذا فشلت التهيئة المخصصة (بسبب وجودها مسبقاً)، نستخدم النسخة الافتراضية
      firestore = getFirestore(app);
    }

    // 5. تهيئة Auth
    const auth = getAuth(app);

    const instances = { app, firestore, auth };
    
    // تخزين عالمي لضمان بقاء المراجع حية أثناء الـ Refresh
    g.__FIREBASE_STABLE_INSTANCES__ = instances;

    return instances;
  } catch (error) {
    console.error("Firebase Sync Error:", error);
    // العودة للوضع الافتراضي في حالة الفشل لتجنب كسر التطبيق
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { 
      app, 
      firestore: getFirestore(app), 
      auth: getAuth(app) 
    };
  }
}
