'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل (Client Provider).
 * يضمن تشغيل التهيئة مرة واحدة فقط ويحافظ على استقرار النسخ لمنع أخطاء الـ Assertion.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // تفعيل الحالة عند التحميل في المتصفح لضمان تزامن الهيدرة
    setMounted(true);
  }, []);

  // جلب النسخ المستقرة باستخدام useMemo لمنع إعادة التهيئة المتكررة أثناء الرندرة
  const instances = useMemo(() => {
    if (!mounted) return { app: null, firestore: null, auth: null };
    return initializeFirebase();
  }, [mounted]);

  // منع الرندرة على السيرفر لضمان سلامة كود Firebase
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <FirebaseProvider 
      firebaseApp={instances.app} 
      firestore={instances.firestore} 
      auth={instances.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
