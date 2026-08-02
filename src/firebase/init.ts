'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase مع حماية مكثفة ضد أخطاء الـ Assertion (ID: ca9).
 * نستخدم نمط Singleton مخزن على مستوى النافذة (window) لضمان استقرار الحالة
 * حتى مع تحديثات الكود السريعة في Next.js، ونعتمد على ذاكرة التخزين المؤقت (Memory Cache)
 * لتجنب مشاكل IndexedDB.
 */

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  // استخدام الكائن العالمي window لضمان نسخة وحيدة عبر الـ HMR
  const global = window as any;

  try {
    // 1. تهيئة التطبيق (App)
    if (!global.__FIREBASE_APP__) {
      global.__FIREBASE_APP__ = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    }
    const app = global.__FIREBASE_APP__;

    // 2. تهيئة Firestore مع ذاكرة التخزين المؤقت (Memory Cache)
    // هذا هو الحل الجذري لمنع خطأ ca9 الناتج عن تعارض الوصول للقاعدة المحلية
    if (!global.__FIREBASE_FIRESTORE__) {
      try {
        global.__FIREBASE_FIRESTORE__ = initializeFirestore(app, {
          localCache: memoryLocalCache(),
        });
      } catch (e) {
        // في حال كان قد تم تهيئته مسبقاً (أو فشلت التهيئة المخصصة)
        global.__FIREBASE_FIRESTORE__ = getFirestore(app);
      }
    }
    const firestore = global.__FIREBASE_FIRESTORE__;

    // 3. تهيئة نظام المصادقة (Auth)
    if (!global.__FIREBASE_AUTH__) {
      global.__FIREBASE_AUTH__ = getAuth(app);
    }
    const auth = global.__FIREBASE_AUTH__;

    return { 
      app, 
      firestore, 
      auth 
    };
  } catch (error) {
    console.error("❌ Critical Firebase Initialization Error:", error);
    // محاولة أخيرة للوصول للخدمات في حال حدوث خطأ غير متوقع
    try {
      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      return { app, firestore: getFirestore(app), auth: getAuth(app) };
    } catch (finalError) {
      return { app: null, firestore: null, auth: null };
    }
  }
}
