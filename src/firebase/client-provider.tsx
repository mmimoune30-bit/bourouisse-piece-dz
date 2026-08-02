'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل - النسخة المؤمنة.
 * يضمن تثبيت مراجع Firebase عبر useRef لمنع أخطاء ca9 الناتجة عن إعادة التهيئة.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  
  // استخدام Ref لتثبيت المراجع ومنع تغيرها مع الـ Re-render
  const firebaseInstances = useRef<{
    app: any;
    firestore: any;
    auth: any;
  }>(null);

  useEffect(() => {
    // تتم التهيئة مرة واحدة فقط بعد mount المكون في المتصفح
    if (!firebaseInstances.current) {
      const { app, firestore, auth } = initializeFirebase();
      (firebaseInstances as any).current = { app, firestore, auth };
    }
    setIsReady(true);
  }, []);

  // شاشة انتظار حتى استقرار الخدمات
  if (!isReady || !firebaseInstances.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-black tracking-widest text-[10px] uppercase opacity-50">
            Establishing Secure Connection...
          </span>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={firebaseInstances.current.app} 
      firestore={firebaseInstances.current.firestore} 
      auth={firebaseInstances.current.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
