'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود Firebase للعميل.
 * يستخدم useRef لتثبيت مراجع Firebase ومنع إعادة الإنشاء مع كل Re-render.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  // useRef يضمن بقاء المراجع ثابتة تماماً خلال دورة حياة المكون
  const instancesRef = useRef<{
    app: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    // نقوم بالتهيئة مرة واحدة فقط بعد mount المتصفح لضمان استقرار البيئة
    if (!instancesRef.current) {
      instancesRef.current = initializeFirebase();
    }
    setIsMounted(true);
  }, []);

  // منع أخطاء Hydration عبر الانتظار حتى استقرار المتصفح
  if (!isMounted || !instancesRef.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-black tracking-widest text-[10px] uppercase opacity-50">Initializing Secure Database...</span>
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
