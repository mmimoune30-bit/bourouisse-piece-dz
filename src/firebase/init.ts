'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * نظام تهيئة Firebase بنمط النسخة الوحيدة العالمي (Global Singleton Pattern).
 * يعالج هذا النظام خطأ INTERNAL ASSERTION FAILED (ID: ca9) عبر منع إعادة التهيئة المتكررة.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  // استخدام كائن globalThis لضمان بقاء النسخ حية ومستقرة عبر عمليات Hot Reload
  const g = globalThis as any;

  if (g.__FIREBASE_READY__) {
    return {
      app: g.__FIREBASE_APP__,
      firestore: g.__FIREBASE_FIRESTORE__,
      auth: g.__FIREBASE_AUTH__
    };
  }

  try {
    // 1. إدارة نسخة التطبيق
    const existingApps = getApps();
    const app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);

    // 2. إدارة نسخة Firestore (النقطة الحرجة لخطأ ca9)
    let firestore: Firestore;
    try {
      // محاولة التهيئة بالإعدادات المخصصة مرة واحدة فقط
      firestore = initializeFirestore(app, {
        localCache: memoryLocalCache(),
      });
    } catch (e) {
      // في حال كان Firestore مهيأ مسبقاً (HMR)، نسترجع النسخة الافتراضية
      firestore = getFirestore(app);
    }

    // 3. إدارة نسخة المصادقة
    const auth = getAuth(app);

    // تخزين النسخ عالمياً لمنع التكرار
    g.__FIREBASE_APP__ = app;
    g.__FIREBASE_FIRESTORE__ = firestore;
    g.__FIREBASE_AUTH__ = auth;
    g.__FIREBASE_READY__ = true;

    return { app, firestore, auth };
  } catch (error) {
    console.error("Critical Firebase Singleton Init Error:", error);
    // استعادة أخيرة في حالة الفشل
    const app = initializeApp(firebaseConfig);
    return { 
      app, 
      firestore: getFirestore(app), 
      auth: getAuth(app) 
    };
  }
}
