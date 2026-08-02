'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل.
 * يضمن التهيئة الآمنة والوحيدة بعد Mount لضمان عدم حدوث Assertion errors.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [instances, setInstances] = useState<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // تنفيذ التهيئة مرة واحدة فقط عند تحميل العميل
    const result = initializeFirebase();
    if (result.app) {
      setInstances(result);
    }
  }, []);

  // ننتظر حتى تكتمل التهيئة قبل تقديم الخدمات للمكونات التابعة
  if (!instances) {
    return null;
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
