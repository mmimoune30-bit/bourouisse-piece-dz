'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase باستخدام نمط Singleton الصارم.
 * يتم تخزين النسخ في متغيرات خارج نطاق الدالة لضمان بقائها مستقرة
 * عبر عمليات إعادة التحميل السريعة (HMR) في Next.js، مما يمنع خطأ ca9.
 */

let cachedApp: FirebaseApp | undefined;
let cachedFirestore: Firestore | undefined;
let cachedAuth: Auth | undefined;

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  try {
    // 1. التأكد من تهيئة التطبيق مرة واحدة فقط
    if (!cachedApp) {
      cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    }

    // 2. الحصول على نسخة Firestore المستقرة المرتبطة بالتطبيق
    if (!cachedFirestore) {
      cachedFirestore = getFirestore(cachedApp);
    }

    // 3. الحصول على نسخة Auth المستقرة المرتبطة بالتطبيق
    if (!cachedAuth) {
      cachedAuth = getAuth(cachedApp);
    }

    return { 
      app: cachedApp, 
      firestore: cachedFirestore, 
      auth: cachedAuth 
    };
  } catch (error) {
    console.error("❌ Firebase Initialization Error:", error);
    return { app: null, firestore: null, auth: null };
  }
}
