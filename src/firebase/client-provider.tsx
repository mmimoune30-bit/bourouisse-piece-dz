'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود خدمات Firebase الدفاعي.
 * يمنع انهيار التطبيق (Application Error) ويحمي الـ Virtual Engine من التعارضات.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const instancesRef = useRef<{
    app: any;
    db: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !instancesRef.current) {
      try {
        const { app, db, auth } = initializeFirebase();
        instancesRef.current = { app, db, auth };
        setIsReady(true);
      } catch (error) {
        console.error("Critical Firebase Provider Error:", error);
        setIsReady(true); // الاستمرار لتفعيل Error Boundaries إذا لزم الأمر
      }
    } else {
      setIsReady(true);
    }
  }, []);

  // شاشة تحميل ذكية لمنع وميض الواجهة قبل جاهزية قاعدة البيانات
  if (!isReady || !instancesRef.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-2">
            <h2 className="text-white font-black tracking-widest text-xl uppercase">BOUROUISSE</h2>
            <p className="text-white/30 text-[10px] uppercase tracking-widest animate-pulse font-bold">
              Establishing Secure Connection...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={instancesRef.current.app} 
      firestore={instancesRef.current.db} 
      auth={instancesRef.current.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
