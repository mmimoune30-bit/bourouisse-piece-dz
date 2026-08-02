'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, memoryLocalCache, terminate } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase مع حماية قصوى ضد خطأ ca9 (Assertion Failure).
 * نعتمد على الذاكرة فقط (Memory Cache) لمنع تعارض IndexedDB في بيئات Next.js.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  // استخدام globalThis لضمان نسخة وحيدة عبر الـ HMR
  const g = globalThis as any;

  try {
    // 1. إدارة نسخة التطبيق (App)
    if (!g.__FIREBASE_APP__) {
      const existingApps = getApps();
      g.__FIREBASE_APP__ = existingApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
    }
    const app = g.__FIREBASE_APP__;

    // 2. إدارة نسخة Firestore (الحرجة جداً لمنع خطأ ca9)
    if (!g.__FIREBASE_FIRESTORE__) {
      try {
        // نحاول التهيئة بذاكرة التخزين المؤقت فقط
        g.__FIREBASE_FIRESTORE__ = initializeFirestore(app, {
          localCache: memoryLocalCache(),
        });
      } catch (e) {
        // في حال فشل (لأنه مهيأ مسبقاً داخلياً)، نسترجع النسخة الموجودة
        g.__FIREBASE_FIRESTORE__ = getFirestore(app);
      }
    }
    const firestore = g.__FIREBASE_FIRESTORE__;

    // 3. إدارة نسخة المصادقة (Auth)
    if (!g.__FIREBASE_AUTH__) {
      g.__FIREBASE_AUTH__ = getAuth(app);
    }
    const auth = g.__FIREBASE_AUTH__;

    return { app, firestore, auth };
  } catch (error) {
    console.error("❌ Firebase Initialization Panic:", error);
    // محاولة أخيرة دفاعية
    const fallbackApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { 
      app: fallbackApp, 
      firestore: getFirestore(fallbackApp), 
      auth: getAuth(fallbackApp) 
    };
  }
}
