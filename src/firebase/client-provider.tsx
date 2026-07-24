'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل (Client Provider).
 * يضمن تهيئة Firebase بعد تحميل المكون في المتصفح فقط لمنع أخطاء الحالة الداخلية.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [instances, setInstances] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // يتم التنفيذ فقط في المتصفح بعد الهيدريشن (Hydration)
    const firebase = initializeFirebase();
    setInstances({
      app: firebase.app || null,
      firestore: firebase.firestore || null,
      auth: firebase.auth || null,
    });
  }, []);

  // إذا لم تكتمل التهيئة بعد، نقوم بعرض الأطفال مع قيم null للمزود
  // لضمان عدم توقف الموقع عن العمل أثناء التحميل الأولي
  return (
    <FirebaseProvider 
      firebaseApp={instances?.app || null} 
      firestore={instances?.firestore || null} 
      auth={instances?.auth || null}
    >
      {children}
    </FirebaseProvider>
  );
}
