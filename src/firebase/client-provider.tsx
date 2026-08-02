'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل (Client Provider).
 * يضمن تشغيل التهيئة مرة واحدة فقط في المتصفح ويمنع أخطاء الـ Hydration والـ Assertion.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // تفعيل الحالة عند التحميل في المتصفح
    setMounted(true);
  }, []);

  // منع الرندرة على السيرفر لضمان سلامة كود Firebase
  if (!mounted) {
    return <>{children}</>;
  }

  // جلب النسخ من الـ Singleton العالمي
  const { app, firestore, auth } = initializeFirebase();

  return (
    <FirebaseProvider 
      firebaseApp={app} 
      firestore={firestore} 
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
