'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase بنمط النسخة الوحيدة (Strict Singleton Pattern).
 * يمنع هذا النمط تكرار التهيئة الذي يسبب خطأ Assertion ca9 في Firestore.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  // استخدام globalThis كمرجع ثابت عبر عمليات Hot Reload
  const g = globalThis as any;

  try {
    // 1. إدارة نسخة التطبيق (Firebase App)
    if (!g.__FIREBASE_APP__) {
      const existingApps = getApps();
      if (existingApps.length > 0) {
        g.__FIREBASE_APP__ = existingApps[0];
      } else {
        g.__FIREBASE_APP__ = initializeApp(firebaseConfig);
      }
    }

    // 2. إدارة نسخة قاعدة البيانات (Firestore)
    if (!g.__FIREBASE_FIRESTORE__) {
      try {
        // محاولة التهيئة بالإعدادات المخصصة (ذاكرة فقط لمنع تعارض الأقفال)
        g.__FIREBASE_FIRESTORE__ = initializeFirestore(g.__FIREBASE_APP__, {
          localCache: memoryLocalCache(),
        });
      } catch (e) {
        // في حال تم التهيئة مسبقاً، نسترجع النسخة الافتراضية
        g.__FIREBASE_FIRESTORE__ = getFirestore(g.__FIREBASE_APP__);
      }
    }

    // 3. إدارة نسخة المصادقة (Auth)
    if (!g.__FIREBASE_AUTH__) {
      g.__FIREBASE_AUTH__ = getAuth(g.__FIREBASE_APP__);
    }

    return { 
      app: g.__FIREBASE_APP__ as FirebaseApp, 
      firestore: g.__FIREBASE_FIRESTORE__ as Firestore, 
      auth: g.__FIREBASE_AUTH__ as Auth 
    };
  } catch (error) {
    console.error("Critical Firebase Init Error:", error);
    // محاولة استرجاع أخيرة في حالة الفشل الكارثي
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { 
      app, 
      firestore: getFirestore(app), 
      auth: getAuth(app) 
    };
  }
}
