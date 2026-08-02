'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * مزود خدمات Firebase الدفاعي.
 * يمنع انهيار التطبيق (Application Error) ويقضي على خطأ ID: ca9 عبر تثبيت الأغراض.
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
        if (app && db && auth) {
          instancesRef.current = { app, db, auth };
          setIsReady(true);
        } else {
          // محاولة ثانية في حال فشل Singleton المؤقت
          setTimeout(() => {
            const retry = initializeFirebase();
            instancesRef.current = { app: retry.app, db: retry.db, auth: retry.auth };
            setIsReady(true);
          }, 100);
        }
      } catch (error) {
        console.error("Firebase Provider Crash:", error);
        setIsReady(true);
      }
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady || !instancesRef.current?.app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-2">
            <h2 className="text-white font-black tracking-widest text-xl uppercase">BOUROUISSE</h2>
            <p className="text-white/30 text-[10px] uppercase tracking-widest animate-pulse font-bold">
              Initializing Secure Database Engine...
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
