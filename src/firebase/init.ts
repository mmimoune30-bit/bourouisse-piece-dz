'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase مع حماية نهائية ضد خطأ ca9 (Assertion Failure).
 * يعتمد الحل على التأكد من عدم استدعاء initializeFirestore إلا مرة واحدة فقط في حياة التطبيق.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  // استخدام globalThis كمرجع أخير لضمان الـ Singleton عبر HMR
  const g = globalThis as any;

  try {
    const existingApps = getApps();
    
    if (existingApps.length > 0) {
      // إذا كان التطبيق موجوداً، نسترجع النسخ الحالية دون إعادة تهيئة
      if (!g.__FIREBASE_APP__) g.__FIREBASE_APP__ = getApp();
      if (!g.__FIREBASE_FIRESTORE__) g.__FIREBASE_FIRESTORE__ = getFirestore(g.__FIREBASE_APP__);
      if (!g.__FIREBASE_AUTH__) g.__FIREBASE_AUTH__ = getAuth(g.__FIREBASE_APP__);
    } else {
      // تهيئة لأول مرة فقط
      g.__FIREBASE_APP__ = initializeApp(firebaseConfig);
      // نضبط ذاكرة التخزين المؤقت هنا فقط لأنها المرة الأولى
      g.__FIREBASE_FIRESTORE__ = initializeFirestore(g.__FIREBASE_APP__, {
        localCache: memoryLocalCache(),
      });
      g.__FIREBASE_AUTH__ = getAuth(g.__FIREBASE_APP__);
    }

    return { 
      app: g.__FIREBASE_APP__ as FirebaseApp, 
      firestore: g.__FIREBASE_FIRESTORE__ as Firestore, 
      auth: g.__FIREBASE_AUTH__ as Auth 
    };
  } catch (error) {
    console.warn("Firebase Recovery Mode:", error);
    // محاولة استرجاع آمنة في حال حدوث أي خلل
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { 
      app, 
      firestore: getFirestore(app), 
      auth: getAuth(app) 
    };
  }
}
