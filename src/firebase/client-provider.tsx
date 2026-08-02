'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل - النسخة المستقرة.
 * يضمن تثبيت مراجع Firebase ومنع أخطاء Hydration و Assertion (ca9).
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  
  // استخدام Ref لتثبيت مراجع النسخ ومنع إعادة الإنشاء مع كل رندر
  const instances = useRef<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // التهيئة تتم مرة واحدة فقط بعد mount المتصفح
    if (!instances.current) {
      instances.current = initializeFirebase();
    }
    setReady(true);
  }, []);

  // الانتظار حتى استقرار خدمات Firebase في المتصفح
  if (!ready || !instances.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-black tracking-widest text-[10px] uppercase opacity-50">Securely Connecting to Firestore...</span>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={instances.current.app} 
      firestore={instances.current.firestore} 
      auth={instances.current.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
