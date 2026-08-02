'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  initializeFirestore, 
  memoryLocalCache 
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * تهيئة Firebase بشكل آمن ومستقر لتجنب أخطاء Assertion (ID: ca9) 
 * الناتجة عن التكرار في بيئة Next.js (Fast Refresh).
 * 
 * الحل المطبق:
 * 1. استخدام Singleton صارم عبر كائن 'window' لضمان عدم إعادة الإنشاء عند تحديث الكود (HMR).
 * 2. استخدام memoryLocalCache() لتعطيل محاولات الوصول لـ IndexedDB التي تسبب غالباً تعارضات الحالة.
 */

export function initializeFirebase() {
  // لا نقوم بالتهيئة إلا في المتصفح
  if (typeof window === 'undefined') return {};

  const g = window as any;

  try {
    // 1. تهيئة التطبيق (Singleton)
    if (!g.__FIREBASE_APP__) {
      const existingApps = getApps();
      if (existingApps.length > 0) {
        g.__FIREBASE_APP__ = existingApps[0];
      } else {
        g.__FIREBASE_APP__ = initializeApp(firebaseConfig);
      }
    }

    // 2. تهيئة Firestore (Singleton) - هذا هو الجزء الحساس للخطأ ca9
    if (!g.__FIREBASE_FIRESTORE__) {
      try {
        // نستخدم initializeFirestore مع memoryLocalCache لتجنب مشاكل الوصول لملفات IndexedDB
        // التي تسبب خطأ "Unexpected state (ID: ca9)" عند فتح تبويبات متعددة أو إعادة التحميل السريع.
        g.__FIREBASE_FIRESTORE__ = initializeFirestore(g.__FIREBASE_APP__, {
          localCache: memoryLocalCache(),
        });
      } catch (innerError) {
        // إذا فشلت التهيئة الصريحة (لأنها تمت بالفعل داخلياً مثلاً)، نقوم بجلب النسخة الافتراضية
        g.__FIREBASE_FIRESTORE__ = getFirestore(g.__FIREBASE_APP__);
      }
    }

    // 3. تهيئة Auth (Singleton)
    if (!g.__FIREBASE_AUTH__) {
      g.__FIREBASE_AUTH__ = getAuth(g.__FIREBASE_APP__);
    }

    return { 
      app: g.__FIREBASE_APP__, 
      firestore: g.__FIREBASE_FIRESTORE__, 
      auth: g.__FIREBASE_AUTH__ 
    };
  } catch (error) {
    // في حالة حدوث خطأ كارثي، نحاول إرجاع أي نسخ تم إنشاؤها بالفعل
    return {
      app: g.__FIREBASE_APP__ || null,
      firestore: g.__FIREBASE_FIRESTORE__ || null,
      auth: g.__FIREBASE_AUTH__ || null
    };
  }
}
