'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache, 
  Firestore 
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase باستخدام نمط Singleton العالمي والتهيئة الدفاعية.
 * يحل هذا الملف مشكلة Firestore Assertion (ID: ca9) عبر تعطيل التخزين المستمر
 * واستخدام ذاكرة التخزين المؤقت (Memory Cache) فقط في بيئة التطوير.
 */

// متغيرات محلية للحفاظ على النسخ داخل الموديول
let globalApp: FirebaseApp | null = null;
let globalFirestore: Firestore | null = null;
let globalAuth: Auth | null = null;

export function initializeFirebase() {
  // التأكد من التنفيذ في المتصفح فقط
  if (typeof window === 'undefined') {
    return { app: null, firestore: null, auth: null };
  }

  const _window = window as any;

  // إذا كانت النسخ موجودة في الكائن العالمي (window)، نستخدمها مباشرة
  if (_window.__FIREBASE_INSTANCES__) {
    return _window.__FIREBASE_INSTANCES__;
  }

  // إذا لم تكن موجودة، نبدأ عملية التهيئة الدفاعية
  try {
    // 1. تهيئة التطبيق (App)
    if (!globalApp) {
      const apps = getApps();
      globalApp = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    }

    // 2. تهيئة قاعدة البيانات (Firestore) مع تعطيل Persistence لمنع خطأ ca9
    if (!globalFirestore) {
      try {
        globalFirestore = initializeFirestore(globalApp, {
          localCache: memoryLocalCache()
        });
      } catch (e) {
        // إذا فشل initializeFirestore (غالباً لأنه تم مسبقاً)، نستخدم getFirestore
        globalFirestore = getFirestore(globalApp);
      }
    }

    // 3. تهيئة نظام المصادقة (Auth)
    if (!globalAuth) {
      globalAuth = getAuth(globalApp);
    }

    // تخزين النسخ في الكائن العالمي لضمان الاستمرارية عبر HMR
    _window.__FIREBASE_INSTANCES__ = { 
      app: globalApp, 
      firestore: globalFirestore, 
      auth: globalAuth 
    };

    console.log("🔥 Firebase Initialized Successfully (Memory Cache Enabled)");
  } catch (error) {
    console.error("❌ Critical: Firebase failed to initialize:", error);
    return { app: null, firestore: null, auth: null };
  }

  return _window.__FIREBASE_INSTANCES__;
}
