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
    // تنفيذ التهيئة مرة واحدة فقط عند تحميل العميل في المتصفح
    const result = initializeFirebase();
    if (result.app && result.firestore) {
      setInstances(result);
    }
  }, []);

  // ننتظر حتى تكتمل التهيئة قبل تقديم الخدمات للمكونات التابعة
  // هذا يمنع محاولة الوصول لـ firestore قبل أن تصبح النسخة المستقرة جاهزة
  if (!instances) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-black tracking-widest text-xs uppercase opacity-50">Initializing Firebase...</span>
        </div>
      </div>
    );
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
