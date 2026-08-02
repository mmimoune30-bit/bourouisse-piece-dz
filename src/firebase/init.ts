'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase باستخدام نمط Singleton العالمي لبيئة Next.js.
 * يحل هذا الملف مشكلة Firestore Assertion (ID: ca9) عبر تخزين النسخ في كائن window.
 */

export function initializeFirebase() {
  // التأكد من التنفيذ في المتصفح فقط
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  const _window = window as any;

  // إذا كانت النسخ موجودة مسبقاً (HMR)، نستخدمها مباشرة
  if (!_window.__FIREBASE_INSTANCES__) {
    try {
      const apps = getApps();
      const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
      
      // الحصول على النسخ المستقرة
      const firestore = getFirestore(app);
      const auth = getAuth(app);

      _window.__FIREBASE_INSTANCES__ = { app, firestore, auth };
      console.log("🔥 Firebase Initialized Successfully (Global Singleton)");
    } catch (error) {
      console.error("❌ Critical: Firebase failed to initialize:", error);
      return { app: null, firestore: null, auth: null };
    }
  }

  return _window.__FIREBASE_INSTANCES__;
}
