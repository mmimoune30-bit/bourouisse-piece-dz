'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * نظام تهيئة Firebase بنمط النسخة الوحيدة (Singleton).
 * يعالج خطأ INTERNAL ASSERTION FAILED (ID: ca9) عبر الاعتماد على نظام إدارة النسخ المدمج في Firebase.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  const g = globalThis as any;

  // استرجاع النسخ إذا كانت مهيأة مسبقاً (Fast Refresh / HMR)
  if (g.__FIREBASE_READY__) {
    return {
      app: g.__FIREBASE_APP__,
      firestore: g.__FIREBASE_FIRESTORE__,
      auth: g.__FIREBASE_AUTH__
    };
  }

  try {
    // 1. تهيئة التطبيق أو استرجاع الحالي
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

    // 2. استرجاع Firestore بنمط آمن
    // ملاحظة: نستخدم getFirestore بدلاً من initializeFirestore لمنع تعارض ca9
    const firestore = getFirestore(app);

    // 3. استرجاع Auth
    const auth = getAuth(app);

    // تخزين النسخ عالمياً
    g.__FIREBASE_APP__ = app;
    g.__FIREBASE_FIRESTORE__ = firestore;
    g.__FIREBASE_AUTH__ = auth;
    g.__FIREBASE_READY__ = true;

    return { app, firestore, auth };
  } catch (error) {
    console.error("Firebase Init Error:", error);
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return { 
      app, 
      firestore: getFirestore(app), 
      auth: getAuth(app) 
    };
  }
}
