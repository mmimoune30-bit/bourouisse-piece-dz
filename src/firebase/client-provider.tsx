'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل - النسخة المستقرة.
 * يضمن تثبيت مراجع Firebase ومنع أخطاء Hydration و Assertion.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const instancesRef = useRef<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // التهيئة تتم مرة واحدة فقط بعد mount المتصفح لضمان استقرار البيئة
    if (!instancesRef.current) {
      instancesRef.current = initializeFirebase();
    }
    setReady(true);
  }, []);

  // منع أخطاء المزامنة عبر الانتظار حتى استقرار خدمات Firebase
  if (!ready || !instancesRef.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-black tracking-widest text-[10px] uppercase opacity-50">Synchronizing Secure Database...</span>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={instancesRef.current.app} 
      firestore={instancesRef.current.firestore} 
      auth={instancesRef.current.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
