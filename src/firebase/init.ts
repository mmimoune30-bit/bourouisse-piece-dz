'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, initializeFirestore, memoryLocalCache, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * نظام تهيئة Firebase بنمط النسخة الوحيدة (Singleton) المتقدم.
 * يعالج خطأ INTERNAL ASSERTION FAILED (ID: ca9) عبر استخدام ذاكرة التخزين المؤقت
 * ومنع إعادة التهيئة المزدوجة أثناء الـ Fast Refresh.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  const g = globalThis as any;

  // 1. استرجاع النسخ إذا كانت مهيأة مسبقاً في الجلسة الحالية
  if (g.__FIREBASE_READY__) {
    return {
      app: g.__FIREBASE_APP__,
      firestore: g.__FIREBASE_FIRESTORE__,
      auth: g.__FIREBASE_AUTH__
    };
  }

  try {
    // 2. تهيئة التطبيق أو استرجاع الحالي (Idempotent)
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 3. تهيئة Firestore مع فرض "ذاكرة التخزين المؤقت" لمنع تعارض IndexedDB
    let firestore: Firestore;
    try {
      firestore = initializeFirestore(app, {
        localCache: memoryLocalCache(),
      });
    } catch (e) {
      // في حال تم التهيئة مسبقاً بواسطة جزء آخر من الكود
      firestore = getFirestore(app);
    }

    // 4. استرجاع Auth
    const auth = getAuth(app);

    // 5. تخزين النسخ عالمياً لضمان Singleton مطلق
    g.__FIREBASE_APP__ = app;
    g.__FIREBASE_FIRESTORE__ = firestore;
    g.__FIREBASE_AUTH__ = auth;
    g.__FIREBASE_READY__ = true;

    return { app, firestore, auth };
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    // محاولة أخيرة للاسترجاع في حال الفشل الكارثي
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { 
      app, 
      firestore: getFirestore(app), 
      auth: getAuth(app) 
    };
  }
}
