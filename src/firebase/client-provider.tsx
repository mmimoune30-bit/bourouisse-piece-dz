'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل.
 * يضمن التهيئة الآمنة بعد Mount لضمان عدم حدوث Assertion errors في Firestore.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [instances, setInstances] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // نقوم بالتهيئة فقط عند التحميل الأول في المتصفح
    const result = initializeFirebase();
    setInstances(result);
  }, []);

  // ننتظر حتى تكتمل التهيئة قبل تقديم الخدمات
  // هذا يمنع المكونات التابعة من محاولة استخدام Firestore قبل استقراره
  if (!instances) {
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
