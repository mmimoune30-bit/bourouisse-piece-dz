'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

/**
 * تهيئة Firebase بشكل آمن ومستقر.
 * تضمن هذه الوظيفة عدم تكرار إنشاء النسخ (Singletons) لتجنب أخطاء Firestore Assertion.
 */
export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    // 1. تهيئة التطبيق (App)
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    // 2. تهيئة الخدمات (Services) لمرة واحدة فقط
    if (!firestore) {
      firestore = getFirestore(app);
    }
    if (!auth) {
      auth = getAuth(app);
    }
  }

  return { app, firestore, auth };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
