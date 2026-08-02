'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase باستخدام نمط Singleton العالمي.
 * هذا الملف يحل مشكلة Firestore Assertion (ID: ca9) من خلال الاعتماد على
 * getFirestore() بدلاً من initializeFirestore() المتكرر.
 */

let app: FirebaseApp | undefined;
let firestore: Firestore | undefined;
let auth: Auth | undefined;

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  try {
    // 1. تهيئة أو استعادة التطبيق
    if (!app) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    }

    // 2. الحصول على نسخة Firestore المستقرة
    // نستخدم getFirestore مباشرة لأنه يتعامل داخلياً مع النسخ الموجودة
    if (!firestore) {
      firestore = getFirestore(app);
    }

    // 3. الحصول على نسخة Auth المستقرة
    if (!auth) {
      auth = getAuth(app);
    }

    return { app, firestore, auth };
  } catch (error) {
    console.error("❌ Firebase Initialization Error:", error);
    return { app: null, firestore: null, auth: null };
  }
}
