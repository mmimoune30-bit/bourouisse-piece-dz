'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase بشكل مبسط ومستقر لمعالجة خطأ Firestore Assertion (ID: ca9).
 * يعتمد هذا الحل على نظام Singleton الداخلي لـ Firebase لمنع تكرار التهيئة.
 */

let cachedApp: FirebaseApp | undefined;
let cachedFirestore: Firestore | undefined;
let cachedAuth: Auth | undefined;

export function initializeFirebase() {
  // التأكد من التنفيذ في المتصفح فقط
  if (typeof window === 'undefined') return {};

  try {
    // 1. جلب أو إنشاء نسخة التطبيق
    if (!cachedApp) {
      const apps = getApps();
      cachedApp = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    }

    // 2. جلب نسخة Firestore (تلقائياً Singleton من قبل Firebase SDK)
    if (!cachedFirestore) {
      cachedFirestore = getFirestore(cachedApp);
    }

    // 3. جلب نسخة Auth
    if (!cachedAuth) {
      cachedAuth = getAuth(cachedApp);
    }

    return { 
      app: cachedApp, 
      firestore: cachedFirestore, 
      auth: cachedAuth 
    };
  } catch (error) {
    console.error("Critical: Firebase failed to initialize:", error);
    return {
      app: cachedApp || null,
      firestore: cachedFirestore || null,
      auth: cachedAuth || null
    };
  }
}
