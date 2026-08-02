'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل.
 * يضمن التهيئة الآمنة والوحيدة بعد Mount لضمان عدم حدوث Assertion errors.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // نستخدم useMemo لضمان استقرار النسخ بعد الـ Mount
  const instances = useMemo(() => {
    if (!isMounted) return null;
    return initializeFirebase();
  }, [isMounted]);

  // ننتظر حتى تكتمل التهيئة قبل تقديم الخدمات للمكونات التابعة
  if (!instances || !instances.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-black tracking-widest text-[10px] uppercase opacity-50">Secure Booting Firebase...</span>
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
